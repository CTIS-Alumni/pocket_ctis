import {buildSearchQuery, doMultiQueries, doquery} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

const columns = {
    high_school_name: "h.high_school_name",
    city: "ci.city_name",
    country: "co.country_name"
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

                    res.status(200).json({data:data.data, length: data.data.length, errors: errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload.user === "admin") {
                    try {
                        const {high_school_name, city_id} = req.body.highschool;
                        const query = "INSERT INTO highschool(high_school_name, city_id) values(?,?)";
                        const data = await doquery({query: query, values: [high_school_name, city_id]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
        }
    } else {
        res.status(500).json({error: "Unauthorized"});
    }
}