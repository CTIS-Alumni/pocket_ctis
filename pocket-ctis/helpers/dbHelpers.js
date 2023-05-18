import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";
import {reFormatDate} from "./formatHelpers";
import {sendActivationMail, sendAdminActivationMail} from "./mailHelper";
import formidable from "formidable";
import fs from "fs/promises";
import {resizeAndCropImage} from "./imageHelper";

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

export const buildSearchQuery = async (req, query, values, length_query, length_values, columns, group_by = null) => {
    if(req.query.searchcol && req.query.search){
        const cols = req.query.searchcol.split(",");
        let searchColumns = [];
        cols.forEach((column)=>{
            if(columns.hasOwnProperty(column))
                searchColumns.push(columns[column]);
        });

        query += addAndOrWhere(query, "(");
        length_query += addAndOrWhere(length_query, "(");
        searchColumns.forEach(function(column){
            query += column + " LIKE CONCAT('%', ?, '%') OR "
            length_query += column + " LIKE CONCAT('%', ?, '%') OR ";
            values.push(req.query.search);
            length_values.push(req.query.search);
        });

        query = query.slice(0,-3) + ") ";
        length_query = length_query.slice(0,-3) + ") ";
    }

    if(group_by){
        query += " GROUP BY " + group_by + " ";
    }

    if (req.query.column && columns.hasOwnProperty(req.query.column) && req.query.order && (req.query.order === "asc" ||req.query.order === "desc")) {
        query += "ORDER BY " + columns[req.query.column] + " " + req.query.order + " ";
    }

    if (req.query.offset && req.query.limit) {
        query += "LIMIT ? OFFSET ? ";
        values.push(req.query.limit);
        values.push(req.query.offset);
    }

    return {query, length_query};

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
        if(!datum.hasOwnProperty("user_id") && field_conditions.user.user_id)
            datum.user_id = field_conditions.user.user_id;
        if(datum.hasOwnProperty("user_id") && !field_conditions.user.user_id){}
            field_conditions.user.user_id = datum.user_id;
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

    data.forEach((datum) => {
        user_id = datum.user_id ? datum.user_id : user_id;

        let query = `INSERT INTO ${table} (` + (user_id ? "user_id, " : "") +
            `${fields.basic.concat(fields.date).join(", ")}) values (` + (user_id ? ":user_id, ": "") +
            fields.basic.map(field => `:${field}`).join(", ") + ", ";

        fields.date.forEach((field) => {
            datum[field] = reFormatDate(datum[field]);
            if(datum[field]){
                if(datum[field].includes("T")) {
                    datum[field] = datum[field].split("T")[0] + "T" + "00:00:00.000Z"
                }
                query += `STR_TO_DATE(:${field}, '%Y-%m-%dT%H:%i:%s.000Z'), `;
            }
            else query += `:${field}, `;
        });
        datum.user_id = user_id;
        queries.push({
            user_id: user_id,
            query: query.slice(0, -2) + ")",
            values: datum
        });
    });
    return queries;
}

export function buildUpdateQueries(data, table, fields){
    let queries = [];

    data.forEach((datum) => {
        let query = `UPDATE ${table} SET ` + fields.basic.map(field => `${field} = :${field}`).join(", ") + ", ";
        fields.date.forEach((field) => {
            if(datum[field])
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

export const getCountForUser = async (connection, table, user_id) => { //gets the count of records a user has in a certain table, used for checking limits
    const query = "SELECT COUNT(*) as count FROM " + table + " WHERE user_id = ? ";
    const [count_res] = await connection.execute(query, [user_id]);
    return count_res[0].count;
}

export const doqueryNew = async ({query, values = [], namedPlaceholders = false}) => {
    console.log("why is it wrong", query, values);
    const connection = await createDBConnection(namedPlaceholders);
    try {
        const [data] = await connection.execute(query, values);
        connection.end();
        return {data};
    } catch (error) {
        return {errors: [{error: error.message}]};
    }
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

export const buildSingleInsertQuery = (data, fields, table) => {
    let query = `INSERT INTO ${table} (`  +
        `${fields.basic.concat(fields.date).join(", ")}) values (` +
        fields.basic.map(field => `:${field}`).join(", ") + ", ";

    fields.date.forEach((field) => {
        data[field] = reFormatDate(data[field]);
        if(data[field]){
            if(data[field].includes("T")) {
                data[field] = data[field].split("T")[0] + "T" + "00:00:00.000Z"
            }
            query += `STR_TO_DATE(:${field}, '%Y-%m-%dT%H:%i:%s.000Z'), `;
        }
        else query += `:${field}, `;
    });
    query = query.slice(0, -2) + ")"
    return query;
}

export const doMultiQueries = async (queries, namedplaceholders = false) => {
    let data = {};
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await createDBConnection(namedplaceholders);

    await Promise.all(queries.map(async (query) => {
        try {
            const [res] = await connection.execute(query.query, query.values);
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

export async function updateTable(queries, validation, select_queries = []) {//put requests/UPDATE
    let data = {};
    let errors = [];
    let is_valid;

    const connection = await createDBConnection(true);

    for(const [index, query] of queries.entries()){
        try{
            is_valid = "Invalid Values!"
            if(typeof validation === "function")
                is_valid = validation(query.values);
            if(typeof validation !== "function" || is_valid === true ){
                let get_res = []
                if(select_queries.length > 0)
                    [get_res] = await connection.execute(select_queries[index].query, select_queries[index].values);

                if(get_res.length > 0){
                    const error_message = select_queries[index].query.includes("user_id") ? "Data is not unique for user!" : "Another user has already taken this";
                    errors.push({name: query.name, error: error_message, queries, select_queries});
                }else{
                    const [res] = await connection.execute(query.query, query.values);
                    data[query.name] = res;
            }
            }else errors.push({name: query.name, error: is_valid})
        }catch(error){
            error.message = handleDBErrorMessage(error);
            errors.push({index: index, error: error.message});
        }
    }
    connection.end();
    return {data, errors};
}

export const insertWithImage = async (query, obj, validation, file_objs, targetWidth, targetHeight) => { //files: [{file: {filedata}, name: 'newnameyouwant', location: 'foldername' }]
    const errors = [];
    const data = [];
    const connection = await createDBConnection(true);

    try{
        await connection.beginTransaction();

        let is_valid = true;
        if(typeof validation === "function"){
            is_valid = validation(obj); //checks for both type fields and user fields
            if (is_valid !== true)
                throw {message: is_valid};
        }
        const [res] = await connection.execute(query, obj);

        for(const [key, value] of Object.entries(file_objs)){
            const destinationFilePath = process.env.PUBLIC_IMAGES_PATH + value.location + "/" + value.name + ".png";
            const resizedBuffer = await resizeAndCropImage(value[key], targetWidth, targetHeight);
            await fs.writeFile(destinationFilePath, resizedBuffer);
        }

        data.push(obj);

    }catch(error){
        error.message = handleDBErrorMessage(error);
        errors.push({error: error.message});
        await connection.rollback();
    }

    await connection.commit();

    connection.end();
    return {data, errors};
}

export const createUser = async(user, validation) => {

    const connection = await createDBConnection(true);
    let data = [];
    let errors = [];

    const type_query = "INSERT INTO useraccounttype(user_id, type_id) values (:user_id, :type_id) ";
    const user_query = "INSERT INTO users(bilkent_id, first_name, last_name, gender, contact_email) values " +
        " (:bilkent_id, :first_name, :last_name, :gender, :contact_email) ";
    const profile_picture_query = "INSERT INTO userprofilepicture(user_id, profile_picture) values (:user_id, 'defaultuser') ";

    try {
        await connection.beginTransaction();

        let is_valid = validation(user); //checks for both type fields and user fields
        if (is_valid !== true)
            throw {message: is_valid};

        const [res] = await connection.execute(user_query, user);

        if (!res.hasOwnProperty("insertId") || res.insertId == 0) //if you managed to insert to db, get the id of the record you inserted
            throw {message: "Failed to create user!"};

        user.id = res.insertId

        for (const [i, type] of user.types.entries()) {
            const type_values = {user_id: user.id, type_id: type};
            const [type_res] = await connection.execute(type_query, type_values);
        }

        const [results] = await connection.execute(profile_picture_query, {user_id: user.id});

        const mail_status = await sendActivationMail(user);

        if (mail_status !== true) {
            throw {message: "Could not send account activation mail to user.", details: mail_status};
        }


        let admin_mail_status = "Not an admin";

        if(user.types.includes('4')){
            admin_mail_status = await sendAdminActivationMail(user);
            if(admin_mail_status !== true)
                throw {message: "Could not admin send account activation mail to user.", details: mail_status};
        }

        data.push({data: {id: user.id, mail_status: mail_status, admin_mail_status: admin_mail_status} });

        await connection.commit();

    }catch(error) {
        error.message = handleDBErrorMessage(error);
        errors.push({error: error.message});
        await connection.rollback();
    }

    connection.end();
    return {data, errors};

}

export const createUsersWithCSV = async (users, validation) => {

    const connection = await createDBConnection(true);

    let data = []; //iterate all users //get query objects -> they should have a user query, a type query, and a edu_record query
    let errors = [];
    const type_query = "INSERT INTO useraccounttype(user_id, type_id) values (:user_id, :type_id) ";
    const user_query = "INSERT INTO users(bilkent_id, first_name, last_name, gender, contact_email) values " +
        " (:bilkent_id, :first_name, :last_name, :gender, :contact_email) ";
    const profile_picture_query = "INSERT INTO userprofilepicture(user_id, profile_picture) values (:user_id, 'defaultuser') ";


    for(const [index, user] of users.entries()){
        try{
            await connection.beginTransaction();

            let edu_record_query = "INSERT INTO educationrecord(user_id, edu_inst_id, degree_type_id, name_of_program, " +
                "start_date, end_date, is_current) values (:user_id, :edu_inst_id, :degree_type_id, :name_of_program,";

            let types = user.types.split(",");

            types = types.map((type) => type.trim()).filter((type) => type !== '');
            user.types = types;

            let is_valid = validation(user); //checks for both type fields, user fields and edu_record fields
            if(is_valid !== true)
                throw {message: is_valid};

            const [res] = await connection.execute(user_query, user);

            if (!res.hasOwnProperty("insertId") || res.insertId == 0) //if you managed to insert to db, get the id of the record you inserted
               throw {message: "Failed to create user!"};

            const user_id = res.insertId;

            for(const [i, type] of types.entries()){
                const type_values = {user_id: user_id, type_id: type};
                const [type_res] = await connection.execute(type_query, type_values);
            }

            const [results] = await connection.execute(profile_picture_query, {user_id: user_id});

            if(user.edu_inst_id && user.degree_type_id && user.name_of_program && user.start_date){
                const edu_values = {
                    user_id: user_id,
                    edu_inst_id: user.edu_inst_id,
                    degree_type_id: user.degree_type_id,
                    name_of_program: user.name_of_program,
                    start_date: user.start_date,
                    end_date: user.end_date,
                    is_current: user.is_current
                }
                edu_values.start_date = reFormatDate(user.start_date);
                if(user.start_date){
                    edu_values.start_date += "T00:00:00.000Z";
                    edu_record_query += `STR_TO_DATE(:start_date, '%Y-%m-%dT%H:%i:%s.000Z'), `;
                }
                else edu_record_query += `:start_date, `;

                edu_values.end_date = reFormatDate(user.end_date);
                if(user.end_date){
                    edu_values.end_date += "T00:00:00.000Z";
                    edu_record_query += `STR_TO_DATE(:end_date, '%Y-%m-%dT%H:%i:%s.000Z'), `;
                }
                else edu_record_query += `:end_date, `;

                edu_record_query += " :is_current) ";
                const [edu_res] = await connection.execute(edu_record_query, edu_values);
            }

            data.push({index: index, data: {id: user_id, bilkent_id: user.bilkent_id} });

            await connection.commit();

        }catch(error){
            error.message = handleDBErrorMessage(error);
            errors.push({index: index, error: error.message});
            await connection.rollback();
        }

    }
    connection.end();
    return {data, errors};

}

//used in users/[user_id]/ api's
export const insertToUserTable = async (queries, table, validation, select_queries = [], limit = null) => {
    let data = [];
    let errors = [];
    let count = 0;
    let is_valid;

    const connection = await createDBConnection(true);
    if(limit)
        count = await getCountForUser(connection, table, queries[0].user_id);   //how many of that data type does the user already have
    for (const [index, query] of queries.entries()){
        try {
            is_valid = "Invalid Values!"

            if(typeof validation === "function")
                is_valid = validation(query.values);

            if(typeof validation !== "function" || is_valid === true ){
                let equal = [];
                if(select_queries.length > 0)
                [equal] = await connection.execute(select_queries[index].query, select_queries[index].values); //is there data that's similar/same as this data
                if (equal.length > 0) {           //if yes then according to whether you checked the entire db or only this particular user give error msg
                    const error_message = select_queries[index].query.includes("user_id") ? "Data is not unique for user!" : "Another User Has Already Taken This";
                    errors.push({index: index, error: error_message});

                } else {
                    if (!limit || count < limit) {      //if there is no limit or if we're still below the limit (per user)
                        const [res] = await connection.execute(query.query, query.values);

                        if (res.hasOwnProperty("insertId") && res.insertId != 0) {      //if you managed to insert to db then get the id of the record you inserted
                            const get_inserted_query = "SELECT * FROM " + table + " WHERE id = ? ";
                            const [inserted] = await connection.execute(get_inserted_query, [res.insertId]);
                            data.push({index: index, res: res, inserted: inserted[0]});
                            count++;
                        }
                    } else {
                        errors.push({index: index, error: "Limit Exceeded!"});
                    }
                }
            } else {
                errors.push({index: index, error: is_valid})
            }
        } catch
            (error) {
            error.message = handleDBErrorMessage(error);
            errors.push({index: index, error: error.message});
        }
    }
    connection.end();
    return {data, errors};
}

//inserts to plain tables without user_id's like skills, companies, highschools
export const insertToTable = async(queries, table, validation = null) => {
    let data = [];
    let errors = [];
    let is_valid;

    const connection = await createDBConnection(true);

    for (const [index, query] of queries.entries()){
        try{
            is_valid = "Invalid Values!"

            if(typeof validation === "function")
                is_valid = validation(query.values);

            if(typeof validation !== "function" || is_valid === true ){
                const [res] = await connection.execute(query.query, query.values);

                if (res.hasOwnProperty("insertId") && res.insertId != 0) {
                    const get_inserted_query = "SELECT * FROM " + table + " WHERE id = ? ";
                    const [inserted] = await connection.execute(get_inserted_query, [res.insertId]);
                    data.push({index: index, res: res, inserted: inserted[0]});
                }
            } else errors.push({index: index, error: is_valid})
        }catch(error){
            error.message = handleDBErrorMessage(error);
            errors.push({index: index, error: error.message});
        }
    }
    connection.end();
    return {data, errors};
}

//can be used to insert multiple edu_records, erasmus records, internship records, basically any records with a user_id
export const insertToUserRelatedTable = async (queries, table, validation = true, select_queries = [], limit = null) => {//this func is for api/internships, api/gradprojects, api/erasmus, api/edurecords
    let data = [];
    let errors = [];
    let count = {};
    let is_valid;

    const connection = await createDBConnection(true);

    for (const [index, query] of queries.entries()){
        try {
            is_valid = "Invalid Values!"

            if(typeof validation === "function")
                is_valid = validation(query.values);

            if(typeof validation !== "function" || is_valid === true ){        //if validation isnt a function or and the data is valid
                let equal = [];

                if(select_queries.length > 0)        //is there data similar to this
                    [equal] = await connection.execute(select_queries[index].query, select_queries[index].values);

                if (equal.length > 0) {        //if yes then according to whether you checked the entire db or this particular user only give error msg
                    const error_message = select_queries[index].query.includes("user_id") ? "Data is not unique for user!" : "Another User Has Already Taken This";
                    errors.push({index: index, error: error_message});

                } else {
                    if(limit && !count.hasOwnProperty(query.user_id))   //if we have a limit restriction and if count object doesnt already have a key for this particular user
                        count[query.user_id] = await getCountForUser(connection, table, query.user_id); //get the number of items the user has and map it to count object

                    if (!limit || count[query.user_id] < limit) {  //if we dont have a limit restriction or if we have restriction but we are still below it
                        const [res] = await connection.execute(query.query, query.values);              //do the query and get the id of the inserted value

                        if (res.hasOwnProperty("insertId") && res.insertId != 0) {
                            const get_inserted_query = "SELECT * FROM " + table + " WHERE id = ? ";
                            const [inserted] = await connection.execute(get_inserted_query, [res.insertId]);
                            data.push({index: index, res: res, inserted: inserted[0]});
                            count[query.user_id]++;
                        }
                    } else {
                        errors.push({index: index, error: "Limit Exceeded!"});
                    }
                }
            } else errors.push({index: index, error: is_valid})
        } catch (error) {
            error.message = handleDBErrorMessage(error);
            errors.push({index: index, error: error.message});
        }
    }

    connection.end();
    return {data, errors};
}

const handleDBErrorMessage = (error) => {
    if(error.message.includes("constraint fails"))
        return "Referenced ID doesn't exist!";
    if(error.message.includes("Duplicate entry"))
        return "Duplicate entry!";
    if(error.message.includes("Incorrect datetime"))
        return "Invalid Date Value!";
    return error.message;
}




