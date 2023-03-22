import {
    buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable,
    doMultiQueries,
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const table_name = "userlocation";

const fields = {
    basic: ["country_id", "city_id", "visibility"],
    date: []
};

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const location = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(location, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(location, table_name, fields);
                    const {data, errors} = await doMultiQueries(queries, true);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(location, table_name);
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