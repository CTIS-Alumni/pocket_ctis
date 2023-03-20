import {
    addAndOrWhere,
    createGetQueries,
    createPostQueries,
    insertToTable,
    doquery, buildInsertQueries, buildSelectQueries
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import  limitPerUser from '../../../../config/moduleConfig.js';

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
                    let values = [];
                    let query = "SELECT i.id, i.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                        "i.company_id, i.department, c.company_name, i.semester, i.start_date, i.end_date, i.rating, i.opinion, i.visibility as 'record_visibility' " +
                        "FROM internshiprecord i JOIN users u on (i.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (i.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = i.user_id)  " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN company c ON (i.company_id = c.id) ";

                    if(payload.user !== "admin"){
                        query += addAndOrWhere(query, " (i.visibility = 1 OR i.user_id = ?)");
                        values.push(payload.user_id);
                    }

                    query += "GROUP BY i.id ORDER BY i.record_date DESC";

                    const data = await doquery({query: query, values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
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