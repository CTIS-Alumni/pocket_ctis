import {buildInsertQueries, doquery, doqueryNew, insertToTable} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const table_name = "worktype"

const fields = {
    basic: ["work_type_name"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data)
    if(!data.work_type_name)
        return "Work type name can't be empty!"
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res); //everyone logged in can get
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, work_type_name FROM worktype order by work_type_name asc";
                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin") { //TODO CHECK WITH USER ADDABLES
                    try {
                        const {worktypes} = JSON.parse(req.body);
                        const queries = buildInsertQueries(worktypes, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    }else {
        res.redirect("/401", 401);
    }
}

export default checkApiKey(handler);