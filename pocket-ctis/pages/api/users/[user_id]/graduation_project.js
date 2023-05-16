import {
    buildSelectQueries,
    buildInsertQueries,
    buildUpdateQueries,
    doMultiDeleteQueries,
    updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

const field_conditions = {
    must_be_different: ["graduation_project_id"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["graduation_project_id", "graduation_project_description", "visibility"],
    date: []
};

const table_name = "usergraduationproject";

const validation = (data) => {
    replaceWithNull(data)
    if(!data.graduation_project_id)
        return "Please select a graduation project!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid Values!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const grad_projects = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                if(payload?.user === "admin"){
                    try{
                        const select_queries = buildSelectQueries(grad_projects, table_name, field_conditions);
                        const queries = buildInsertQueries(grad_projects, table_name, fields, user_id);
                        const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.graduation_projects);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: {error: error.message}});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "PUT":
                try {
                    if(payload?.user === "owner"){
                        fields.basic = ["graduation_project_description", "visibility"];
                        }
                    const queries = buildUpdateQueries(grad_projects, table_name, fields);
                    const select_queries = buildSelectQueries(grad_projects, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                if(payload?.user === "admin"){
                    try{
                        const {data, errors} = await doMultiDeleteQueries(grad_projects, table_name);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}