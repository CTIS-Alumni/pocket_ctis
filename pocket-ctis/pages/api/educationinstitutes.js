import {
    addAndOrWhere,
    buildInsertQueries,
    buildSearchQuery, buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    insertToTable, updateTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";
import {corsMiddleware} from "./middleware/cors";

const columns = {
    edu_inst_name: "ei.edu_inst_name",
    id: "ei.id",
    country_id: "co.id",
    city_id: "ci.id",
    city_name: "ci.city_name",
    country_name: "country_name",
    is_erasmus: "is_erasmus"

}

const table_name = "educationinstitute";
const fields = {
    basic: ["edu_inst_name","city_id","is_erasmus"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data)
    if(!data.edu_inst_name)
        return "Education Institute Name can't be empty!";
    if(data.city_id && isNaN(parseInt(data.city_id)))
        return "City Id must be a number!";
    if(isNaN(parseInt(data.is_erasmus)) || (parseInt(data.is_erasmus) !== 1 && parseInt(data.is_erasmus) !== 0))
        return "Invalid value for erasmus field!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SElECT ei.id, ei.edu_inst_name, ei.city_id, ci.city_name, co.id AS 'country_id', co.country_name, ei.is_erasmus "
                    if(req.query.erasmus && (payload.user === "admin" || (payload.user !== "admin" && modules.erasmus.user_visible))) {
                        query += ", AVG(er.rating) AS rating ";
                    }
                       query +=  "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";
                    let length_query = "SELECT COUNT(DISTINCT ei.id) as count FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id)" +
                        " LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                    //for erasmus page = showing only the universities which is for erasmus
                    if (req.query.erasmus) { //for the erasmus page
                        query += "LEFT OUTER JOIN erasmusrecord er ON (er.edu_inst_id = ei.id) WHERE ei.is_erasmus = ? ";
                        length_query += "LEFT OUTER JOIN erasmusrecord er ON (er.edu_inst_id = ei.id) WHERE ei.is_erasmus = ? ";
                        values.push(req.query.erasmus);
                        length_values.push(req.query.erasmus);
                    }
                    if (req.query.name) { //for the general search
                        query += addAndOrWhere(query, " ei.edu_inst_name LIKE CONCAT('%', ?, '%') ");
                        length_query += addAndOrWhere(length_query, " ei.edu_inst_name LIKE CONCAT('%', ?, '%') ");
                        values.push(req.query.name);
                        length_values.push(req.query.name);
                    }

                    if(req.query.erasmus){
                        query += " GROUP BY ei.id ";
                    }


                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    if(req.query.erasmus && payload.user !== "admin" && !modules.erasmus.user_visible){
                        data.data = [];
                        data.length[0].count = 0;
                    }


                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                if(payload?.user === "admin") {
                    try{
                        const {educationinstitutes} = JSON.parse(req.body);
                        console.log("heres education institutes", educationinstitutes);
                        const queries = buildUpdateQueries(educationinstitutes, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "POST":
                if(payload.user === "admin" || modules.edu_insts.user_addable) {
                    try {
                        const {educationinstitutes} = JSON.parse(req.body);
                        const queries = buildInsertQueries(educationinstitutes, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "DELETE":
                if(payload.user === "admin"){
                    try {
                        const {educationinstitutes} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(educationinstitutes, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));