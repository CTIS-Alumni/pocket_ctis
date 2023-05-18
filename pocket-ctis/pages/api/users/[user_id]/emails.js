import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries, updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

const fields = {
    basic: ["email_address", "visibility"],
    date: []
};


const table_name = "useremail";

const validation = (data) => {
    replaceWithNull(data);
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email_regex.test(data.email_address))
        return "Invalid email format!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid values for visibility!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const emails = JSON.parse(req.body);
                    const queries = buildInsertQueries(emails, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, [], modules.user_profile_data.emails.limit_per_user);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const emails = JSON.parse(req.body);
                    const queries = buildUpdateQueries(emails, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const emails = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(emails, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}