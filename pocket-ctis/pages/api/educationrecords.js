import {addAndOrWhere, buildSearchQuery, doMultiQueries, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const columns = {
    user: " (CONCAT(u.first_name, ' ', u.last_name) LIKE CONCAT('%', ?, '%') OR  " +
"CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name) LIKE CONCAT('%', ?, '%'))  ",
    edu_inst_name: "ei.edu_inst_name",
    edu_inst_id: "ei.edu_inst_id",
    degree_type_name: "d.degree_type_name",
    degree_type_id: "d.degree_type_id",
    name_of_program: "e.name_of_program",
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const is_admin = payload.user === "admin";
                    let values = [], length_values = [], length_query = "";
                    let query = "select e.id, e.user_id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', upp.profile_picture, u.first_name, u.last_name, e.edu_inst_id, ei.edu_inst_name," +
                        "ci.city_name, co.country_name, d.degree_type_name, e.name_of_program, e.start_date, e.end_date, e.is_current, e.record_date ";

                    const add = "FROM educationrecord e JOIN users u ON (e.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                        "JOIN degreetype d ON (e.degree_type_id = d.id) " +
                        "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id)" +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                    query += add;
                    length_query = "SELECT COUNT(*) as count FROM educationrecord " ;

                    if (req.query.edu_inst_id) {
                        query += " WHERE e.edu_inst_id = ? ";
                        values.push(req.query.edu_inst_id);

                        if(is_admin){
                            length_query += " WHERE e.edu_inst_id = ? ";
                            length_values.push(req.query.edu_inst_id);
                        }
                    }

                    if (payload.user !== "admin") {
                        query += addAndOrWhere(query, " (e.visibility = 1 OR e.user_id = ?) ");
                        values.push(payload.user_id);
                    }

                    if(is_admin){
                        ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns, "e.id"));

                        const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                            {name: "length", query: length_query, values: length_values}]);

                        res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                    }else {
                        query += " GROUP BY e.id ORDER BY e.record_date DESC LIMIT 15"
                        const {data, errors} = await doqueryNew({query: query, values});
                        res.status(200).json({data, errors});

                    }
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);