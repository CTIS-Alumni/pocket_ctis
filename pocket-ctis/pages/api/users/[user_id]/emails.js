import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries, updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const fields = {
    basic: ["email_address", "visibility"],
    date: []
};


const table_name = "useremail";

const validation = (data) => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email_regex.test(data.email_address))
        return "Invalid email format!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid Values!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const emails = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(emails, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, [], limitPerUser.emails);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(emails, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(emails, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}