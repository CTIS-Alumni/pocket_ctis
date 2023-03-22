import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable, updateTable,
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const field_conditions = {
    must_be_different: ["phone_number"],
    date_fields: [],
    user: {
        check_user_only: false,
        user_id: null
    }
}

const fields = {
    basic: ["phone_number", "visibility"],
    date: []
};


const table_name = "userphone";

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    if(data.phone_number.trim() === "")
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const phones = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(phones, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(phones, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.phone_numbers);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(phones, table_name, fields);
                    const select_queries = buildSelectQueries(phones, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(phones, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}