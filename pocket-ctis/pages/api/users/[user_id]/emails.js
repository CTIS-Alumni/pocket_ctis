import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries, updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const field_conditions = {
    must_be_different: ["email_address"],
    date_fields: [],
    user: {
        check_user_only: false,
        user_id: null
    }
}

const fields = {
    basic: ["email_address", "visibility"],
    date: []
};


const table_name = "useremail";

const validation = (data) => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email_regex.test(data.email_address))
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const emails = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(emails, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(emails, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.emails);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(emails, table_name, fields);
                    const select_queries = buildSelectQueries(emails, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(emails, table_name);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}