import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";

export function addCondition(query, condition){
    let full_condition;
    if (query.includes(" WHERE ")) {
        full_condition =  " AND ";
    } else {
        full_condition = " WHERE ";
    }
    full_condition += condition + " ";
    return full_condition;
}

export async function doMultiQueries(queries, namedplaceholders = false) {
    let data = {};
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database,
        namedPlaceholders: namedplaceholders
    });

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

export async function doMultiPutQueries(queries, get_queries, validation) {
    let data = {};
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database,
        namedPlaceholders: true
    });

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

export async function doMultiInsertQueries(queries, get_queries, table, limit, validation) {
    let data = [];
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database,
        namedPlaceholders: true
    });

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

export function createGetQueries(data, table_name, fields_to_check, user_id, get_count, global) {
    global = global || false;
    let queries = [];
    const base_query = "SELECT id FROM " + table_name + " WHERE "

    data.forEach((datum) => {
        let tempValues = [];
        let tempQuery = base_query;
        fields_to_check.forEach((val) => {
            if (datum.hasOwnProperty(val)) {
                if(datum[val] == null){
                    tempQuery += val + " IS NULL AND ";
                }else{
                    if(val.includes("date"))
                        tempQuery += val + " = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') AND ";
                    else tempQuery += val + " = ? AND ";
                    tempValues.push(datum[val]);
                }
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

export function createPostQueries(data, base_query, base_values, opt_values, user_id) {
    let queries = [];

    data.forEach((datum) => {
        let hasOwnProp = [...base_values];
        let tempValues = {};
        let tempQuery = base_query;
        base_values.forEach((base_val) => {
            if (base_val === "user_id")
                tempValues.user_id = user_id;
            else tempValues[base_val] = datum[base_val];
        });
        opt_values.forEach((val)=>{
           if(datum.hasOwnProperty(val)){
               tempQuery += ","+ val + " ";
               tempValues[val] = datum[val];
               hasOwnProp.push(val);
           }
        });
        tempQuery += ") values (";
        hasOwnProp.forEach((val)=>{
            if(datum[val] != null && val.toString().includes("date")){
                datum[val] = datum[val].split("T")[0] + "T00:00:00.000Z";
                tempQuery += "STR_TO_DATE(:" + val + ", '%Y-%m-%dT%H:%i:%s.000Z'),";
            }
            else tempQuery +=":" + val + ",";
        });
        tempQuery = tempQuery.slice(0, -1);
        tempQuery += ")";
        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });
    return queries;
}

export function createPutQueries(data, base_query, base_values, opt_values) {
    let queries = [];
    data.forEach((datum) => {
        let tempValues = {};
        let tempQuery = base_query;
        base_values.forEach((base_val) => {
            tempValues[base_val] = datum[base_val];
        });

        opt_values.forEach((val) => {
            if (datum.hasOwnProperty(val)) {
                if (val.toString().includes("date") && datum[val] != null) {
                    datum[val] = datum[val].split("T")[0] + "T00:00:00.000Z";
                    tempQuery += " " + val + " = STR_TO_DATE(:" + val + ", '%Y-%m-%dT%H:%i:%s.000Z'), ";
                } else tempQuery += " " + val + " = :" + val + ",";
                tempValues[val] = datum[val];
            }
        });
        tempQuery = tempQuery.slice(0, -1);
        tempQuery += " WHERE id = :id";
        tempValues.id = datum.id;

        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });
    return queries;
}


export async function doquery({query, values = []}) {
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database
    });

    try {
        const [data] = await connection.execute(query, values);
        connection.end();
        return data;
    } catch (error) {
        return {error};
    }
}


