import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable,
    doMultiQueries,
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {corsMiddleware} from "../../middleware/cors";
import {checkApiKey} from "../../middleware/checkAPIkey";

const field_conditions = {
    must_be_different: ["project_name"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["project_name", "project_description", "visibility"],
    date: []
};

const table_name = "userproject";

const validation = (data) => {
    replaceWithNull(data)
    if(data.visibility !== 1 && data.visibility !== 0)
        return "Invalid values for visibility!";
    if(!data.project_name)
        return "Project name can't be empty!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const projects = JSON.parse(req.body);
                    const queries = buildInsertQueries(projects, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(projects, table_name,field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation,  select_queries, modules.user_profile_data.projects.limit_per_user);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const projects = JSON.parse(req.body);
                    const queries = buildUpdateQueries(projects, table_name, fields);
                    const select_queries = buildSelectQueries(projects, table_name, field_conditions);
                    const {data, errors} = await doMultiQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const projects = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(projects, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    } res.status(403).json({errors: [{error: "Forbidden request!"}]});
}

export default corsMiddleware(handler);