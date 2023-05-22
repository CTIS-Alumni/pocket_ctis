import {
    addAndOrWhere,
    buildInsertQueries,
    buildSearchQuery, buildSelectQueries,
    doMultiQueries,
    insertToUserRelatedTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import modules from "../../config/moduleConfig";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import {corsMiddleware} from "./middleware/cors";

const columns = {
    user: " (CONCAT(u.first_name, ' ', u.last_name) LIKE CONCAT('%', ?, '%') OR  " +
        "CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name) LIKE CONCAT('%', ?, '%'))  ",
    inst_name: "ei.edu_inst_name",
    country: "co.country_name",
    city: "ci.city_name"
}

const fields = {
    basic: ["edu_inst_id", "semester"],
    date: ["start_date", "end_date"]
}

const field_conditions = {
    must_be_different: ["edu_inst_id", "semester"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}


const table_name = "erasmusrecord";

const validation = (data) => {
    replaceWithNull(data);
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(isNaN(parseInt(data.user_id)))
        return "User ID must be a number!";
    if(isNaN(parseInt(data.edu_inst_id)))
        return "Education Institute ID must be a number!";
    if(!data.semester)
        return "Semester can't be empty!";
    if(!startDate)
        return "Please enter a start date!";
    if (endDate && startDate > endDate)
        return "Start Date can't be after End Date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Dates can't be after current date!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                if(payload.user === "admin" || (payload.user !== "admin" &&  modules.erasmus.user_visible)){
                    try {
                        let values = [], length_values = [];
                        let query = "SELECT e.id, e.user_id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', upp.profile_picture, u.first_name, u.last_name, " +
                            "e.edu_inst_id, ei.edu_inst_name, ei.city_id, ci.city_name, ci.country_id, co.country_name, e.semester, e.start_date, e.end_date, e.rating, e.opinion " +
                            "FROM erasmusrecord e JOIN users u on (e.user_id = u.id) " +
                            "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                            "JOIN useraccounttype uat ON (uat.user_id = e.user_id) " +
                            "JOIN accounttype act ON (act.id = uat.type_id) " +
                            "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                            "LEFT OUTER JOIN city ci ON (ci.id = ei.city_id) " +
                            "LEFT OUTER JOIN country co ON (co.id = ci.country_id) ";

                        let length_query = "SELECT COUNT(DISTINCT e.id) as count " +
                            "FROM erasmusrecord e JOIN users u on (e.user_id = u.id) " +
                            "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                            "LEFT OUTER JOIN city ci ON (ci.id = ei.city_id) " +
                            "LEFT OUTER JOIN country co ON (co.id = ci.country_id) " +
                            "JOIN useraccounttype uat ON (uat.user_id = e.user_id)  " +
                            "JOIN accounttype act ON (act.id = uat.type_id) ";


                        if (payload.user !== "admin") {
                            query += addAndOrWhere(query, " (e.visibility = 1 OR e.user_id = ?) ");
                            length_query += addAndOrWhere(length_query, " (e.visibility = 1 OR e.user_id = ?) ");
                            values.push(payload.user_id);
                            length_values.push(payload.user_id);
                        }

                        ({query, length_query} = await buildSearchQuery(req, query, values, length_query, length_values, columns, "e.id"));


                        const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                            {name: "length", query: length_query, values: length_values}]);

                        res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(200).json({data: [], errors: []})
                break;
            case "POST":
                if(payload?.user === "admin") {
                    try {
                        const {erasmus} = JSON.parse(req.body);
                        const queries = buildInsertQueries(erasmus, table_name, fields);
                        const select_queries = buildSelectQueries(erasmus, table_name,field_conditions);
                        const {data, errors} = await insertToUserRelatedTable(queries, table_name, validation, select_queries, modules.user_profile_data.erasmus.limit_per_user);
                        res.status(200).json({data, errors})

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    }else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));