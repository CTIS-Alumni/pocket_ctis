import mysql from "mysql2/promise";
import dbconfig from "../config/dbconfig.js";

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
