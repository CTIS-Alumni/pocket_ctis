import {addAndOrWhere, buildSearchQuery, doMultiQueries} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

const columns = {
    user: "CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name)",
    inst_name: "ei.edu_inst_name",
    country: "co.country_name",
    city: "ci.city_name"
}

const validation = (data) => {
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (startDate && endDate && startDate > endDate)
        return false;
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    if(data.opinion !== null && data.opinion.trim() === "")
        return false;
    if(data.rating < 0 || data.rating > 10 || (data.rating % 0.5) !== 0)
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT e.id, e.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                        "e.edu_inst_id, ei.edu_inst_name, ei.city_id, ci.city_name, ci.country_id, co.country_name, e.semester, e.start_date, e.end_date, e.rating, e.opinion, e.visibility as 'record_visibility' " +
                        "FROM erasmusrecord e JOIN users u on (e.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = e.user_id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                        "LEFT OUTER JOIN city ci ON (ci.id = ei.city_id) " +
                        "LEFT OUTER JOIN country co ON (co.id = ci.country_id) ";

                    let length_query = "SELECT COUNT(*) as count FROM erasmusrecord e JOIN users u ON (e.user_id = u.id) JOIN educationinstitute ei " +
                        "ON (ei.id = e.edu_inst_id) LEFT OUTER JOIN city ci ON (ci.id = ei.city_id) LEFT OUTER JOIN country co ON (co.id = ci.country_id) ";

                    if (payload.user !== "admin") {
                        query += addAndOrWhere(query, " (e.visibility = 1 OR e.user_id = ?) ");
                        length_query += addAndOrWhere(length_query, " (e.visibility = 1 OR e.user_id = ?) ");
                        values.push(payload.user_id);
                        length_values.push(payload.user_id);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values, length_query, length_values, columns));
                    const split_limit = query.split("LIMIT");

                    query = split_limit[0] + " GROUP BY e.id LIMIT" + split_limit[1];

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.data.length, errors: errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else {
        res.status(500).json({error: "Unauthorized"});
    }
}