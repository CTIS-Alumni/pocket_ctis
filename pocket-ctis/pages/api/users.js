import {
    addAndOrWhere,
    buildInsertQueries,
    buildSelectQueries, buildUpdateQueries, doMultiDeleteQueries,
    doquery, insertToTable, updateTable,
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

const table_name = "users";

const field_conditions = {
    must_be_different: ["bilkent_id"],
    date_fields: [],
    user: {
        check_user_only: false,
        user_id: null
    }
}

const fields = {
    basic: ["first_name", "nee", "last_name", "contact_email", "is_active", "is_retired", "gender", "bilkent_id"],
    date: []
};

const validation = (data) => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.gender !== 1 && data.gender !== 0)
        return false;
    if (data.is_active !== 1 && data.is_active !== 0)
        return false;
    if (data.first_name.trim() == "" || data.last_name.trim() == "")
        return false;
    if (!email_regex.test(data.contact_email))
        return false;
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [];
                    let query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types', u.id, upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name ";
                    query += "FROM users u JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) ";

                    if (req.query.highschool_id) {
                        query += "LEFT OUTER JOIN userhighschool uhs ON (uhs.user_id = u.id) WHERE ";
                        if (payload.user !== "admin") {
                            query += " uhs.high_school_id = ? AND (uhs.visibility = 1 OR uhs.user_id = ?)";
                            values.push(req.query.highschool_id, payload.user_id);
                        } else {
                            query += " uhs.high_school_id = ? ";
                            values.push(req.query.highschool_id);
                        }
                    }

                    if (req.query.wantsector_id) { //for a specific sectors page
                        query += "LEFT OUTER JOIN userwantsector uws ON (uws.user_id = u.id) WHERE ";
                        if (payload.user !== "admin") {
                            query += " uws.sector_id = ? AND (uws.visibility = 1 OR uws.user_id = ?) ";
                            values.push(req.query.wantsector_id, payload.user_id);
                        } else {
                            query += " uws.sector_id = ? ";
                            values.push(req.query.wantsector_id);
                        }
                    }

                    if (req.query.society_id) {
                        query += "LEFT OUTER JOIN userstudentsociety uss ON (uss.user_id = u.id) WHERE ";
                        if (payload.user !== "admin") {
                            query += " uss.society_id = ? AND (uss.visibility = 1 OR uss.user_id = ?) ";
                            values.push(req.query.society_id, payload.user_id);
                        } else {
                            query += " uss.society_id = ? ";
                            values.push(req.query.society_id);
                        }

                    }

                    if (req.query.project_id) {
                        query += " LEFT OUTER JOIN usergraduationproject ugp ON (ugp.user_id = u.id) WHERE ugp.graduation_project_id = ? ";
                        values.push(req.query.project_id);
                    }

                    if (req.query.name) { //for general search
                        query += addAndOrWhere(query, " CONCAT(u.first_name, ' ', u.nee, ' ', u.last_name) LIKE CONCAT('%',?,'%') ");
                        values.push(req.query.name);
                    }

                    query += " GROUP BY uat.user_id ORDER BY u.first_name ASC";

                    const data = await doquery({query: query, values: values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                if (payload.user === "admin") {
                    try {
                        const users = JSON.parse(req.body);
                        const queries = buildInsertQueries(users, table_name);
                        const select_queries = buildSelectQueries(users, table_name, field_conditions);
                        const {data, errors} = await insertToTable(queries, table_name, validation, select_queries)
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                } else res.status(500).json({error: "Unauthorized!"});
                break;
            case "PUT":
                if (payload.user === "admin") {
                    try{
                        const users = JSON.parse(req.body);
                        const queries = buildUpdateQueries(users, table_name, fields);
                        const select_queries = buildSelectQueries(users, table_name, field_conditions);
                        const {data, errors} = await updateTable(queries, validation, select_queries);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({error: error.message});
                    }
                } else res.status(500).json({error: "Unauthorized!"});
                break;
            case "DELETE":
                if(payload.user === "admin"){
                    try{
                        const users = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(users, table_name); //TODO: learn what to do after users are deleted
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({error: error.message});
                    }
                }
        }
    } else {
        res.status(500).json({error: "Unauthorized"});
    }
}