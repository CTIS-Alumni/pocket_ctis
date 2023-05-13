import {
    addAndOrWhere,
    insertToUserRelatedTable,
    buildInsertQueries, buildSelectQueries, buildSearchQuery, doMultiQueries, doqueryNew
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import limitPerUser from "../../config/moduleConfig";
import {replaceWithNull} from "../../helpers/submissionHelpers";

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
    basic: ["company_id", "department", "semester"],
    date: ["start_date", "end_date"]
};

const table_name = "internshiprecord";

const validation = (data) => {
    replaceWithNull(data);
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(isNaN(parseInt(data.user_id)))
        return "User ID must be a number!";
    if(isNaN(parseInt(data.company_id)))
        return "Company ID must be a number!";
    if(!data.semester)
        return "Semester can't be empty!";
    if(!data.department)
        return "Department can't be empty!";
    if(!startDate)
        return "Please enter a start date!";
    if (endDate && startDate > endDate)
        return "Start Date can't be after End Date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Dates can't be after current date!";
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT i.id, i.user_id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
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
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                if (payload?.user === "admin") {
                    try {
                        const {internships} = JSON.parse(req.body);
                        const select_queries = buildSelectQueries(internships, table_name, field_conditions);
                        const queries = buildInsertQueries(internships, table_name, fields);
                        const {data, errors} = await insertToUserRelatedTable(queries, table_name, validation, select_queries, limitPerUser.internships);
                        res.status(200).json({data, errors});

                        let completed_companies = [];
                        const company_update_query = "UPDATE company SET is_internship = 1 WHERE id = ? ";

                        for(const [index, datum] of data.entries()){
                            if(!completed_companies.includes(datum.inserted.company_id)){
                                const results = await doqueryNew({query: company_update_query, values: [datum.inserted.company_id]});
                                if(results.data)
                                    completed_companies.push(datum.inserted.company_id);
                            }
                        }

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden action!"}]});

                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}