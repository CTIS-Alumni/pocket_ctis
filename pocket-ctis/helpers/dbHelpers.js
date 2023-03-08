import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";
import {convertToLastDay} from "./formatHelpers";

export async function doMultiQueries(queries){
    let data = {};
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database
    });

    await Promise.all(queries.map(async(query) => {
        try{
            const [res] = await connection.query(query.query, query.values);
            data[query.name] = res;
        }catch(error){
            errors.push({name: query.name, error: error.message});
        }
    }));
    connection.end();
    return {data, errors};
}

export async function doMultiInsertQueries(queries, table){
    let data = [];
    let errors = [];
    //queries = [{name: "certificates", query: "asdas" ,values: []}, {name: "skills", query: "asdasda", values: []}]
    //errors = [{name: "certificates", error: error}];
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database,
    });

    await Promise.all(queries.map(async(query) => {
        try{
            const [res] = await connection.execute(query.query, query.values);
            if(res.hasOwnProperty("insertId") && res.insertId != 0){
                const select_query = "SELECT * FROM " + table + " WHERE id = ? ";
                const [inserted] = await connection.execute(select_query, [res.insertId]);
                data.push({res: res, inserted: inserted[0]});
            }
        }catch(error){
            errors.push({name: query.name, error: error.message});
        }
    }));
    connection.end();
    return {data, errors};
}

export function createPostQueries(data, base_query, base_values, opt_values, user_id){
    let queries = [];

    data.forEach((datum)=>{
        let hasOwnProp = [...base_values];
        let tempValues = [];
        let tempQuery = base_query;
        base_values.forEach((base_val) =>{
           if(base_val == "user_id")
               tempValues.push(user_id);
           else tempValues.push(datum[base_val]);
        });
        opt_values.forEach((val)=>{
           if(datum.hasOwnProperty(val)){
               tempQuery += ","+ val + " ";
               tempValues.push(datum[val]);
               hasOwnProp.push(val);
           }
        });
        tempQuery += ") values (";
        hasOwnProp.forEach((val)=>{
            if(datum[val] != null && val.toString().includes("date")){
                datum[val] = convertToLastDay(datum[val]);
                tempQuery += "str_to_date(?, '%Y-%m-%dT%H:%i:%s.000Z'),";
            }
            else tempQuery +="?,";
        });
        tempQuery = tempQuery.slice(0,-1);
        tempQuery += ")";
        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });
    return queries;
}

export function createPutQueries(data, base_query, base_values, opt_values){
    let queries = [];
    data.forEach((datum)=>{
        let tempValues = [];
        let tempQuery = base_query;
        base_values.forEach((base_val) =>{
            tempValues.push(datum[base_val]);
        });

        opt_values.forEach((val)=>{
            if(datum.hasOwnProperty(val) ){
                if(val.toString().includes("date") && datum[val] != null){
                    datum[val] = convertToLastDay(datum[val]);
                    tempQuery += " " + val + " = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z'), ";
                }else tempQuery += " " + val + " = ?,";
                tempValues.push(datum[val]);
            }
        });
        tempQuery = tempQuery.slice(0, -1);
        tempQuery += " WHERE id = ?";
        tempValues.push(datum.id);

        queries.push({
            name: datum.id,
            query: tempQuery,
            values: tempValues
        });
    });
    return queries;
}



export async function doquery({query, values = []}){
    const connection = await mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database
    });

    try{
        const [data] = await connection.execute(query, values);
        connection.end();
        return data;
    }catch(error){
        return {error};
    }
}


