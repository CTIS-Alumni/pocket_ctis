import {
    buildSelectQueries,
    buildInsertQueries,
    buildUpdateQueries,
    doMultiDeleteQueries,
    updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

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
    replaceWithNull(data);
    if(!data.skill_id)
        return "Please select a skill!";
    if (data.skill_level != null && (data.skill_level < 1 || data.skill_level > 5))
        return "Invalid values for skill level!";
    if(data.visibility !== 1 && data.visibility !== 0)
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
                    const skills = JSON.parse(req.body);
                    const queries = buildInsertQueries(skills, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(skills, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.skills.limit_per_user);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const skills = JSON.parse(req.body);
                    const queries = buildUpdateQueries(skills, table_name, fields);
                    const select_queries = buildSelectQueries(skills, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const skills = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(skills, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    } res.status(403).json({errors: [{error: "Forbidden request!"}]});
}