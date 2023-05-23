import {
    buildInsertQueries,
    buildSearchQuery, buildUpdateQueries,
    doMultiDeleteQueries,
    doMultiQueries,
    insertToTable, updateTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";
import {corsMiddleware} from "./middleware/cors";

const columns = {
    sector_name: "sector_name",
    id: "id"
}

const fields = {
    basic: ["sector_name"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data);
    if(!data.sector_name)
        return "Sector Name can't be empty!";
    return true;
}

const table_name = "sector"

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        let payload;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT * FROM sector ";
                    let length_query = "SELECT COUNT(*) as count FROM sector ";

                    if (req.query.name) { // for general search
                        query += " WHERE sector_name LIKE CONCAT('%', ?, '%') ";
                        length_query += " WHERE sector_name LIKE CONCAT('%', ?, '%') ";
                        values.push(req.query.name);
                        length_values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
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
                        const {sectors} = JSON.parse(req.body);
                        const queries = buildUpdateQueries(sectors, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin" || modules.sectors.user_addable) {
                    try {
                        const {sectors} = JSON.parse(req.body);
                        const queries = buildInsertQueries(sectors, table_name, fields);
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
                        const {sectors} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(sectors, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    }else{
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));