import {
    addAndOrWhere,
    buildInsertQueries,
    buildSearchQuery,
    doMultiQueries,
    insertToTable
} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const columns = {
    inst_name: "ei.edu_inst_name",
    city: "ci.city_name",
    country: "co.country_name"
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
    if(isNaN(parseInt(data.city_id)))
        return "City Id must be a number!";
    if(isNaN(parseInt(data.is_erasmus)) || (parseInt(data.is_erasmus) !== 1 && parseInt(data.is_erasmus) !== 0))
        return "Invalid value for erasmus field!";
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SElECT ei.id, ei.edu_inst_name, ei.city_id, ci.city_name, co.id AS 'country_id', co.country_name, ei.is_erasmus "
                    if(req.query.erasmus) {
                        query += "AVG(er.rating) AS rating ";
                    }
                       query +=  "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";
                    let length_query = "SELECT COUNT(*) as count FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id)" +
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
                        query += " GROUP BY ei.id";
                        length_query += " GROUP BY ei.id";
                    }

                    console.log(query);

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;

            case "POST": {
                    try {
                        const {educationinstitutes} = JSON.parse(req.body);
                        const queries = buildInsertQueries(educationinstitutes, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
            }
        }
    } else {
        res.redirect("/401", 401);
    }
}