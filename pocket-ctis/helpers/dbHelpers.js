import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";

export const createDBConnection = async (namedPlaceholders = false) => {
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database,
        namedPlaceholders: namedPlaceholders
    });
    return connection;
}

export const addAndOrWhere = (query, condition) => {
    let full_condition;
    if (query.includes(" WHERE ")) {
        full_condition =  " AND ";
    } else {
        full_condition = " WHERE ";
    }
    full_condition += condition + " ";
    return full_condition;
}

export const buildConditionForComparison = (data, field_conditions) => {
    let query = " ";
    field_conditions.must_be_different.forEach((field)=>{
       if(data[field] != null){ //if the field is null check other fields
           query += field + " = :" + field + " AND ";
       }
    });
    field_conditions.date_fields.forEach((field) => {
       if(data[field] != null){ //if the field is null check other fields
           query += "(" + field + " = STR_TO_DATE(:" + field + ", '%Y-%m-%dT%H:%i:%s.000Z') OR " + field + " IS NULL) AND ";
       }
    });

    if(field_conditions.user.check_user_only && field_conditions.user.user_id){
        query += " user_id = :user_id AND ";
    }

    if(data.hasOwnProperty("id"))
        query += " id NOT IN (:id) AND ";

    query = query.slice(0, -4); //remove the "AND " at the end

    return query;
}

export const buildSelectQueries = (data, table, field_conditions) => {
    let queries = [];
    const base_query = "SELECT id FROM " + table + " WHERE ";

    data.forEach((datum) => {
        if(!datum.hasOwnProperty("user_id"))
            datum.user_id = field_conditions.user.user_id;
        let query = base_query + buildConditionForComparison(datum, field_conditions);
        queries.push({
            name: datum.id,
            query: query,
            values: datum
        });
    });

    return queries;
}

export const buildInsertQueries = (data, table, fields, user_id = null) => {
    let queries = [];

    let query = `INSERT INTO ${table} (` + (user_id ? "user_id, " : "") +
        `${fields.basic.concat(fields.date).join(", ")}) values (` + (user_id ? ":user_id, ": "") +
        fields.basic.map(field => `:${field}`).join(", ") + ", ";

    data.forEach((datum) => {
        fields.date.forEach((field) => {
            if(datum[field] !== null)
                query += `STR_TO_DATE(:${field}, '%Y-%m-%dT%H:%i:%s.000Z'), `;
            else query += `:${field}, `;
        });
        queries.push({
            name: datum.id,
            user_id: data?.user_id || user_id,
            query: query.slice(0, -2) + ")",
            values: datum
        });
    });
    return queries;
}

export function buildUpdateQueries(data, table, fields){
    let queries = [];

    let query = `UPDATE ${table} SET ` + fields.basic.map(field => `${field} = :${field}`).join(", ") + ", ";
    data.forEach((datum) => {
        fields.date.forEach((field) => {
            if(datum[field] !== null)
                query += `${field} = STR_TO_DATE(:${field}, '%Y-%m-%dT%H:%i:%s.000Z'), `;
            else query += `${field} = :${field}, `;
        });

        query = `${query.slice(0, -2)} WHERE id = :id`;

        queries.push({
            name: datum.id,
            query: query,
            values: datum
        });
    });

    return queries;
}

export const getCountForUser = async (connection, table, user_id) => {
    const query = "SELECT COUNT(id) as count FROM " + table + " WHERE user_id = ? ";
    const [count_res] = await connection.execute(query, user_id);
    return count_res[0].count;
}

export const doquery = async ({query, values = []}) => {
    const connection = await createDBConnection();
    try {
        const [data] = await connection.execute(query, values);
        connection.end();
        return data;
    } catch (error) {
        return {error};
    }
}

export const doMultiQueries = async (queries, namedplaceholders = false) => {
    let data = {};
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = createDBConnection(namedplaceholders);

    await Promise.all(queries.map(async (query) => {
        try {
            const [res] = await connection.query(query.query, query.values);
            data[query.name] = res;
        } catch (error) {
            errors.push({name: query.name, error: error.message});
        }
    }));
    connection.end();
    return {data, errors};
}

export const doMultiDeleteQueries = async (records, table) => {
    let queries = [], data = {}, errors = [];
    const tempQuery = "DELETE FROM " + table + " WHERE id = ? ";
    records.forEach((record) => {
        queries.push({
            name: record.id,
            query: tempQuery,
            values: [record.id]
        });
    });

    const connection = await createDBConnection();

    await Promise.all(queries.map(async (query) => {
        try {
            const [res] = await connection.query(query.query, query.values);
            data[query.name] = res;
        } catch (error) {
            errors.push({name: query.name, error: error.message});
        }
    }));
    connection.end();
    return {data, errors};
}

export async function updateTable(queries, validation, get_queries = []) {
    let data = {};
    let errors = [];

    const connection = await createDBConnection(true);

    for(const [index, query] of queries.entries()){
        try{
            if(validation(query.values)){
                const [get_res] = await connection.execute(get_queries[index].query, get_queries[index].values);
                if(get_res.length > 0){
                    const error_message = get_queries[index].query.includes("user_id") ? "Data Must Be Unique" : "Another User Has Already Taken This";
                    errors.push({name: query.name, error: error_message, queries, get_queries});
                }else{
                    const [res] = await connection.execute(query.query, query.values);
                    data[query.name] = res;
            }
            }else errors.push({name: query.name, error: "Invalid Values"})
        }catch(error){
            errors.push({name: query.name, error: error.message, queries, get_queries});
        }
    }
    connection.end();
    return {data, errors};
}

export const insertToUser = async (queries, table, validation, select_queries = [], limit = null) => {
    let data = [];
    let errors = [];
    let count = 0;

    const connection = await createDBConnection(true);

    if(limit)
        count = await getCountForUser(connection, table, queries[0].user_id);

    for (const [index, query] of queries.entries()){
        try {
            if(validation(query.values)){
                let equal = [];

                if(select_queries.length > 0)
                [equal] = await connection.execute(select_queries[index].query, select_queries[index].values);

                if (equal.length > 0) {
                    const error_message = select_queries[index].query.includes("user_id") ? "Data Must Be Unique" : "Another User Has Already Taken This";
                    errors.push({name: query.name, error: error_message});

                } else {
                    if (!limit || count < limit) {
                        const [res] = await connection.execute(query.query, query.values);

                        if (res.hasOwnProperty("insertId") && res.insertId != 0) {
                            const get_inserted_query = "SELECT * FROM " + table + " WHERE id = ? ";
                            const [inserted] = await connection.execute(get_inserted_query, [res.insertId]);
                            data.push({res: res, inserted: inserted[0]});
                            count++;
                        }
                    } else {
                        errors.push({name: query.name, error: "Limit Exceeded!"});
                    }
                }
            } else errors.push({name: query.name, error: "Invalid Values"})
        } catch
            (error) {
            errors.push({name: query.name, error: error.message});
        }
    }

    connection.end();
    return {data, errors};
}

export const insertToTable = async (queries, table, validation, select_queries = [], limit = null) => {
    let data = [];
    let errors = [];
    let count = {};

    const connection = await createDBConnection(true);

    for (const [index, query] of queries.entries()){
        try {
            if(validation(query.values)){
                let equal = [];

                if(select_queries.length > 0)
                    [equal] = await connection.execute(select_queries[index].query, select_queries[index].values);

                if (equal.length > 0) {
                    const error_message = select_queries[index].query.includes("user_id") ? "Data Must Be Unique" : "Another User Has Already Taken This";
                    errors.push({name: query.name, error: error_message});
                } else {
                    if(limit && !count.hasOwnProperty(query.user_id));
                        count[query.user_id] = await getCountForUser(connection, table, query.user_id);
                    if (!limit || count[query.user_id] < limit) {
                        const [res] = await connection.execute(query.query, query.values);
                        if (res.hasOwnProperty("insertId") && res.insertId != 0) {
                            const get_inserted_query = "SELECT * FROM " + table + " WHERE id = ? ";
                            const [inserted] = await connection.execute(get_inserted_query, [res.insertId]);
                            data.push({res: res, inserted: inserted[0]});
                            count[query.user_id]++;
                        }
                    } else {
                        errors.push({name: query.name, error: "Limit Exceeded!"});
                    }
                }
            } else errors.push({name: query.name, error: "Invalid Values"})
        } catch
            (error) {
            errors.push({name: query.name, error: error.message});
        }
    }

    connection.end();
    return {data, errors};
}

export async function doMultiInsertQueries(queries, table, validation, get_queries = [],  limit = null) {
    let data = [];
    let errors = [];
    //queries = [{name: "certificates", query: "SELECT FROM etc" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await createDBConnection(true);

    let count = 0;
    if(limit){
        const count_query = get_queries.pop();
        const [count_res] = await connection.execute(count_query.query, count_query.values);
        count = count_res[0].count;
    }

    for (const [index, query] of queries.entries()){
        try {
            if(validation(query.values)){
                let get_res = [];
                if(get_queries.length > 0)
                    [get_res] = await connection.execute(get_queries[index].query, get_queries[index].values);
                if (get_res.length > 0) {
                    const error_message = get_queries[index].query.includes("user_id") ? "Data Must Be Unique" : "Another User Has Already Taken This";
                    errors.push({name: query.name, error: error_message});
                } else {
                    if (!limit || count < limit) {
                        const [res] = await connection.execute(query.query, query.values);
                        if (res.hasOwnProperty("insertId") && res.insertId != 0) {
                            const select_query = "SELECT * FROM " + table + " WHERE id = ? ";
                            const [inserted] = await connection.execute(select_query, [res.insertId]);
                            data.push({res: res, inserted: inserted[0]});
                            count++;
                        }
                    } else {
                        errors.push({name: query.name, error: "Limit Exceeded!"});
                    }
                }
            }else errors.push({name: query.name, error: "Invalid Values"})
        } catch
            (error) {
            errors.push({name: query.name, error: error.message});
        }
    }
    connection.end();
    return {data, errors};
}

export function createGetQueries(data, table_name, fields_to_check, user_id = null, get_count = false, global = false) {
    let queries = [];
    const base_query = "SELECT id FROM " + table_name + " WHERE "

    data.forEach((datum) => {
        let tempValues = [];
        let tempQuery = base_query;
        fields_to_check.forEach((val) => {
                if(datum[val] == null){
                    tempQuery += val + " IS NULL AND ";
                }else{
                    if(val.includes("date"))
                        tempQuery += val + " = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') AND ";
                    else tempQuery += val + " = ? AND ";
                    tempValues.push(datum[val]);
                }
        });
        if (user_id && !global) {
            tempQuery += "user_id = ? AND "
            tempValues.push(user_id)
        }
        if(datum.hasOwnProperty("id")){
            tempQuery += "id NOT IN (?) "
            tempValues.push(datum.id);
        }
        if(!datum.hasOwnProperty("id"))
            tempQuery = tempQuery.slice(0, -4);
        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });

    if (user_id && get_count) {
        queries.push({
            name: "count",
            query: "SELECT count(*) as count FROM " + table_name + " WHERE user_id = ?",
            values: [user_id]
        });
    }

    return queries;
}

export function createPostQueries(data, table_name, fields, user_id = null, date_fields = []){
    let queries = [];

    data.forEach((datum)=>{
        let tempValues = {};
        let tempQuery = "INSERT INTO " + table_name + "( ";
        let second_half_of_query = "";
        if(user_id){
            tempQuery += "user_id,";
            tempValues["user_id"] = user_id;
            second_half_of_query += ":user_id, ";
        }
        fields.forEach((field)=>{
           tempQuery += field + ",";
           tempValues[field] =  datum[field];
           second_half_of_query += ":" + field + ",";
        });

        date_fields.forEach((date_field)=>{
            tempQuery += date_field + ",";
            if(datum[date_field] != null){
                second_half_of_query += "STR_TO_DATE(:" + date_field + ", '%Y-%m-%dT%H:%i:%s.000Z'),";
            }else second_half_of_query += ":" + date_field + ",";
            tempValues[date_field] = datum[date_field];
        })

        tempQuery = tempQuery.slice(0,-1) + ") values (" + second_half_of_query.slice(0,-1) + ")";

        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });
    return queries;
}





