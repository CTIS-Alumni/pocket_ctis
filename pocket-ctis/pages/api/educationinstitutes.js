import {addAndOrWhere, buildSearchQuery, doMultiQueries, doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

const columns = {
    inst_name: "ei.edu_inst_name",
    city: "ci.city_name",
    country: "co.country_name"
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SElECT ei.id, ei.edu_inst_name, ci.city_name, co.country_name, ei.is_erasmus " +
                        "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";
                    let length_query = "SELECT COUNT(*) as count FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id)" +
                        " LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                    //for erasmus page = showing only the universities which is for erasmus
                    if (req.query.erasmus) { //for the erasmus page
                        query += " WHERE ei.is_erasmus = ? ";
                        length_query += " WHERE ei.is_erasmus = ? ";
                        values.push(req.query.erasmus);
                        length_values.push(req.query.erasmus);
                    }
                    if (req.query.name) { //for the general search
                        query += addAndOrWhere(query, " ei.edu_inst_name LIKE CONCAT('%', ?, '%') ");
                        length_query += addAndOrWhere(length_query, " ei.edu_inst_name LIKE CONCAT('%', ?, '%') ");
                        values.push(req.query.name);
                        length_values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.data.length, errors: errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;

            case "POST": {
                    try {
                        const {inst_name, city_id, is_erasmus} = req.body.erasmus;
                        const query = "INSERT INTO educationinstitute(edu_inst_name, city_id, is_erasmus) values(?,?,?)";
                        const data = await doquery({query: query, values: [inst_name, city_id, is_erasmus]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
            }
        }
    } else {
        res.status(500).json({error: "Unauthorized"});
    }
}