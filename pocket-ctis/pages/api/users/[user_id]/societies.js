import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable, updateTable,
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const field_conditions = {
    must_be_different: ["society_id"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["society_id", "activity_status", "visibility"],
    date: []
};

const table_name = "userstudentsociety";

const validation = (data) => {
    if(!data.society_name)
        return "Please select a student society!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid Values!";
    if(data.activity_status !== 0 && data.activity_status !== 1)
        return "Invalid Values!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const societies = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const select_queries = buildSelectQueries(societies, table_name, field_conditions);
                    const queries = buildInsertQueries(societies, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.student_societies);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(societies, table_name, fields);
                    const select_queries = buildSelectQueries(societies, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(societies, table_name);
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