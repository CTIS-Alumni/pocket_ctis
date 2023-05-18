import {addAndOrWhere, buildSearchQuery, doMultiQueries, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const columns = {
    user: " (CONCAT(u.first_name, ' ', u.last_name) LIKE CONCAT('%', ?, '%') OR  " +
        "CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name) LIKE CONCAT('%', ?, '%'))  ",
    company: "c.company",
    department: "w.department",
    position: "w.position"

}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res); //everyone logged in can get
    const payload = await checkUserType(session, req.query); //ones who arent admin can only see records of themselves or visible ones
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const is_admin = payload.user === "admin";
                    let values = [], length_values = [], length_query = "";
                    let query = "SELECT w.id, w.user_id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', upp.profile_picture, u.first_name, u.last_name, w.company_id, " +
                        "c.company_name, wt.work_type_name, w.department, w.position, w.work_description, w.rating, w.city_id, ci.city_name," +
                        "w.country_id, co.country_name, w.start_date, w.end_date, w.is_current, w.record_date ";

                       const add = "FROM workrecord w JOIN users u ON (w.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (w.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                        "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                        "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (w.country_id = co.id) ";

                       query += add;

                       if(is_admin){
                           length_query = "SELECT COUNT(*) as count  " + add;
                       }

                    if (req.query.company_id) {
                        query += "WHERE w.company_id = ? ";
                        values.push(req.query.company_id);

                        if(is_admin){
                            length_query += "WHERE w.company_id = ? ";
                            length_values.push(req.query.company_id);
                        }
                    }

                    if (req.query.sector_id) {
                        query += addAndOrWhere(query, " c.sector_id = ? ");
                        values.push(req.query.sector_id);
                        if(is_admin){
                            length_query += addAndOrWhere(query, " c.sector_id = ? ");
                            length_query.push(req.query.sector_id);
                        }
                    }
                    if(payload.user !== "admin"){
                        query += addAndOrWhere(query, " (w.visibility = 1 OR w.user_id = ?) ");
                        values.push(payload.user_id);
                   }

                    if(is_admin){
                        ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns, "w.id"));

                        const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                            {name: "length", query: length_query, values: length_values}]);

                        res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                    }else {
                        query += " GROUP BY w.id ORDER BY w.record_date DESC LIMIT 15"
                        const {data, errors} = await doqueryNew({query: query, values});
                        res.status(200).json({data, errors});

                    }
                } catch (error) {
                    res.status(500).json({errors: { error: error.message}});
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}

export default checkApiKey(handler);