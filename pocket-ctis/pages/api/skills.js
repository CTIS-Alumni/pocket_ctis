import {buildInsertQueries, doquery, doqueryNew, insertToTable} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";

const table_name = "skill"

const fields = {
    basic: ["skill_type_id", "skill_name"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data);
    if(!data.skill_name)
        return "Skill Name can't be empty!";
     if(isNaN(parseInt(data.skill_type_id)))
        return "Skill Type ID must be a number!";
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
                    let id_params = "";
                    let query = "SELECT s.id, s.skill_name, s.skill_type_id, st.skill_type_name from skill s LEFT OUTER JOIN skilltype st ON (s.skill_type_id = st.id)";

                    if (req.query.type_id) {
                        query += "WHERE skill_type_id = ? ";
                        id_params = req.query.type_id;
                    }
                    query += "ORDER BY skill_name ASC";

                    const {data, errors} = await doqueryNew({query: query, values: [id_params]});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin") {
                    try {
                        const {skills} = JSON.parse(req.body);
                        const queries = buildInsertQueries(skills, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors})
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);