import {buildUpdateQueries, doquery, updateTable} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const fields = {
    basic: ["first_name", "last_name", "is_retired", "is_active", "gender", "nee"],
    date: []
}

const table_name = "users"

const validation = (data) =>{
    if(data.first_name.trim() == "" || data.last_name.trim() == "")
        return false;
    if(data.is_active !== 1 && data.is_active !== 0)
        return false;
    if(data.is_retired !== 1 && data.is_retired !== 0)
        return false;
    if(data.gender !== 1 && data.gender !== 0)
        return false;
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (payload.user === "admin" || payload.user === "owner") {
        const basic_info = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                        "u.is_retired, u.graduation_project_id, g.project_name, g.project_year, g.project_description, u.is_active FROM users u " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "LEFT OUTER JOIN graduationproject g ON (u.graduation_project_id = g.id) " +
                        "WHERE u.id = ? GROUP BY u.id";

                    const data = await doquery({query: query, values: [user_id]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    if(payload.user === "owner"){
                        fields.basic = ["is_retired"];
                    }
                    const queries = buildUpdateQueries(basic_info, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors, queries});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                if (payload.user === "admin") {
                    try {
                        const query = "DELETE FROM users WHERE id = ?"
                        const data = await doquery({query: query, values: [user_id]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
        }
    } else {
        res.status(500).json({error: "Unauthorized"});
    }
}