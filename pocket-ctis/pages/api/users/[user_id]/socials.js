import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    insertToUser
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

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

const validation = async (data) => {
    if(data.link.trim() == "")
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const socials = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(socials, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(socials, table_name, field_conditions);
                    const {data, errors} = await insertToUser(queries, table_name, validation, select_queries, limitPerUser.social_media);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(socials, table_name, fields);
                    const select_queries = buildSelectQueries(socials, table_name, field_conditions);
                    const {data, errors} = await doMultiQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(socials, table_name);
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