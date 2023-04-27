import {
    addAndOrWhere,
    insertToTable,
    buildInsertQueries, buildSelectQueries, buildSearchQuery, doMultiQueries
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import limitPerUser from "../../config/moduleConfig";

const columns = {
    user: "CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name)",
    company: "c.company_name"
}

const field_conditions = {
    must_be_different: ["company_id", "semester"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["company_id", "department", "semester", "rating", "opinion", "visibility"],
    date: ["start_date", "end_date"]
};

const table_name = "internshiprecord";

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
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        let internships = [];
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT i.id, i.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                        "i.company_id, i.department, c.company_name, i.semester, i.start_date, i.end_date, i.rating, i.opinion " +
                        "FROM internshiprecord i JOIN users u on (i.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (i.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = i.user_id)  " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN company c ON (i.company_id = c.id) ";

                    let length_query = "SELECT COUNT(*) as count FROM internshiprecord i JOIN users u ON (i.user_id = u.id) JOIN company c ON (c.id = i.company_id) ";

                    if(payload.user !== "admin"){
                        query += addAndOrWhere(query, " (i.visibility = 1 OR i.user_id = ?) ");
                        length_query += addAndOrWhere(length_query, " (i.visibility = 1 OR i.user_id = ?) ");
                        values.push(payload.user_id);
                        length_values.push(payload.user_id);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    if(query.includes("LIMIT")){
                        const split_limit = query.split("LIMIT");
                        query = split_limit[0] + " GROUP BY i.id LIMIT " + split_limit[1];
                    }else query += " GROUP BY i.id ";


                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                if (payload.user === "admin") {
                    try {
                        const select_queries = buildSelectQueries(internships, table_name, field_conditions);
                        const queries = buildInsertQueries(internships, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation, select_queries, limitPerUser.internships);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
            case "PUT":
                if (payload.user === "admin") {
                    try {

                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
            case "DELETE":
                if (payload.user === "admin") {
                    try {

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