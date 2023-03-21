import {
    buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    InsertToUser,
    doMultiQueries,
    doquery, insertToUser
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const table_name = "userhighschool";

const fields = {
    basic: ["high_school_id", "visibility"],
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
        const high_schools = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(high_schools, table_name, fields, user_id);
                    const {data, errors} = await insertToUser(queries, table_name, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(high_schools, table_name, fields);
                    const {data, errors} = await doMultiQueries(queries, true);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(high_schools, table_name);
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