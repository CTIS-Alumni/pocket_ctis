import {
    buildInsertQueries,
    buildSearchQuery, buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    insertToTable, updateTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";

const table_name = "skill"

const fields = {
    basic: ["skill_type_id", "skill_name"],
    date: []
}

const columns = {
    skill_name: "s.skill_name",
    skill_type_name: "st.skill_type_name",
    skill_type_id: "st.skill_type_id",
    id: "s.id"
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
                    let values = [], length_query = "", length_values = [];
                    let query = "SELECT s.id, s.skill_name, s.skill_type_id, st.skill_type_name FROM skill s LEFT OUTER JOIN skilltype st ON (s.skill_type_id = st.id) ";
                    length_query = "SELECT COUNT(*) as 'count' FROM skill s LEFT OUTER JOIN skilltype st ON (s.skill_type_id = st.id) ";


                    if (req.query.type_id) {
                        query += " WHERE skill_type_id = ? ";
                        length_query += " WHERE skill_type_id = ? ";
                        values.push(req.query.type_id);
                        length_values.push(req.query.type_id);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin") {
                    try{
                        const {skills} = JSON.parse(req.body);
                        const queries = buildUpdateQueries(skills, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin" || modules.skills.user_addable) {
                    try {
                        const {skills} = JSON.parse(req.body);
                        const queries = buildInsertQueries(skills, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "DELETE":
                payload = await checkUserType(session)
                if(payload.user === "admin"){
                    try {
                        const {skills} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(skills, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);