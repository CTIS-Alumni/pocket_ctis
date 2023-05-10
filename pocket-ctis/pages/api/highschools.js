import {buildInsertQueries, buildSearchQuery, doMultiQueries, doquery, insertToTable} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const columns = {
    high_school_name: "h.high_school_name",
    city: "ci.city_name",
    country: "co.country_name"
}

const fields = {
    basic: ["high_school_name", "city_id"],
    date: []
}

const table_name = "highschool";

const validation = (data) => {
    replaceWithNull(data)
    if(!data.high_school_name)
        return "High School Name can't be empty!";
    if(isNaN(parseInt(data.city_id)))
        return "City ID must be a number!";
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT h.id, h.high_school_name, ci.city_name, co.country_name " +
                        "FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                    let length_query = "SELECT COUNT(*) as count FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                    if (req.query.name) {
                        query += "WHERE h.high_school_name LIKE CONCAT('%', ?, '%') ";
                        values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin") {
                    try {
                        const {highschools} = JSON.parse(req.body);
                        const queries = buildInsertQueries(highschools, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}