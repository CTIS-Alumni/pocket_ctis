import {buildInsertQueries, doqueryNew, insertToTable} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const table_name = "skilltype"

const fields = {
    basic: ["skill_type_name"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data)
    if(!data.skill_type_name)
        return "Skill type name can't be empty!"
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, skill_type_name FROM skilltype order by skill_type_name asc"; //for dropboxes
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
                        const {skilltypes} = JSON.parse(req.body);
                        const queries = buildInsertQueries(skilltypes, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);