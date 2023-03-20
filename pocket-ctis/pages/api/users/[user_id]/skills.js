import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    InsertToUser, updateTable,
    doMultiQueries,
    doquery, insertToUser
} from "../../../../helpers/dbHelpers";
import limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const field_conditions = {
    must_be_different: ["skill_id"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["skill_id", "skill_level", "visibility"],
    date: []
};

const table_name = "userskill";

const validation = (data) => {
    if (data.skill_level != null && (data.skill_level < 1 || data.skill_level > 5))
        return false;
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    return true;

}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const skills = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(skills, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(skills, table_name, field_conditions);
                    const {data, errors} = await insertToUser(queries, table_name, validation, select_queries, limitPerUser.skills);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(skills, table_name, fields);
                    const select_queries = buildSelectQueries(skills, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(skills, table_name);
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