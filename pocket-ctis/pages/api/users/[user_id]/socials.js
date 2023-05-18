import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

const field_conditions = {
    must_be_different: ["social_media_id", "link"],
    date_fields: [],
    user: {
        check_user_only: false,
        user_id: null
    }
}

const fields = {
    basic: ["social_media_id", "link","visibility"],
    date: []
};

const table_name = "usersocialmedia";

const validation = (data) => {
    replaceWithNull(data)
    if(!data.social_media_id)
        return "Please select a social media site!";
    if(!data.link === null)
        return "Link can't be empty!";
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
                    const socials = JSON.parse(req.body);
                    const queries = buildInsertQueries(socials, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(socials, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.social_media.limit_per_user);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const socials = JSON.parse(req.body);
                    const queries = buildUpdateQueries(socials, table_name, fields);
                    const select_queries = buildSelectQueries(socials, table_name, field_conditions);
                    const {data, errors} = await doMultiQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const socials = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(socials, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    } res.status(403).json({errors: [{error: "Forbidden request!"}]});
}