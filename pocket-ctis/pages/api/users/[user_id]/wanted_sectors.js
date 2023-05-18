import {
    insertToUserTable,
    buildInsertQueries, buildSelectQueries, doMultiDeleteQueries, buildUpdateQueries, updateTable,
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import modules from '../../../../config/moduleConfig.js';

const field_conditions = {
    must_be_different: ["sector_id"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["sector_id", "visibility"],
    date: []
}

const table_name = "userwantsector";

const validation = (data) => {
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid values for visibility!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const sectors = JSON.parse(req.body)
                    const select_queries = buildSelectQueries(sectors, table_name, field_conditions);
                    const queries = buildInsertQueries(sectors, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.wanted_sectors.limit_per_user)
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const sectors = JSON.parse(req.body)
                    const queries = buildUpdateQueries(sectors, table_name, fields);
                    const select_queries = buildSelectQueries(sectors, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const sectors = JSON.parse(req.body)
                    const {data, errors} = await doMultiDeleteQueries(sectors, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}