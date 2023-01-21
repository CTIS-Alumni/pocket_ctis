import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";

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
            const [res] = await connection.execute(query.query, query.values);
            data[query.name] = res;
        }catch(error){
            errors.push({name: query.name, error: error});
        }
    }));
    connection.end();
    return {data, errors};

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


