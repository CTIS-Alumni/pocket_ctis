import {
    doMultiDeleteQueries,
    updateTable,
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, buildSearchQuery, doMultiQueries, insertToTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const columns = {
    project_name: "g.graduation_project_name",
    company: "c.company_name",
    advisor: "CONCAT(u.first_name, ' ', u.nee, ' ', u.last_name)",
    year: "g.project_year"
}

const fields = {
    basic: ["graduation_project_name",
        "team_number",
        "product_name",
        "project_year",
        "semester",
        "project_description",
        "advisor_id",
        "project_type",
        "company_id"],
    date: []
};

const table_name = "graduationproject";

const validation = (data) => {
    replaceWithNull(data)
    if(!data.graduation_project_name)
        return "Project Name can't be empty!";
    if(isNaN(parseInt(data.team_number)))
        return "Team Number must be a number!";
    if(!data.project_year)
        return "Project Year can't be empty!";
    if(data.project_year.length !== 9)
        return "Invalid value for Project Year!";
    if(!data.semester)
        return "Semester can't be empty!";
    if(isNaN(parseInt(data.advisor_id)))
        return "Advisor ID must be a number!";
    if(!data.project_type)
        return "Project Type can't be empty!";
    if (data.project_type === "Company" && isNaN(parseInt(data.company_id)))
        return "Company projects must have a valid Company ID!";
    if (data.project_type !== "Company" && data.company_id !== null)
        return "Instructor or student projects can't have a Company ID!";
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT g.id, g.graduation_project_name, g.team_number, g.project_year, g.semester, g.team_pic, g.poster_pic, CONCAT(u.first_name, ' ' ,u.last_name) as advisor, g.project_type, g.company_id, c.company_name " +
                        "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) JOIN users u ON (u.id = g.advisor_id)";
                    let length_query = "SELECT COUNT(*) as count from graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) " +
                        "JOIN users u ON (u.id = g.advisor_id) ";

                    if (req.query.name) {
                        query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        length_query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        length_values.push(req.query.name);
                        values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const {graduationprojects} = JSON.parse(req.body);
                        const queries = buildInsertQueries(graduationprojects, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden action!"}]});
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const {graduationprojects} = JSON.parse(req.body);
                        const queries = buildUpdateQueries(graduationprojects,table_name, fields);
                        const select_queries = buildSelectQueries(graduationprojects, table_name, field_conditions);
                        const {data, errors} = await updateTable(queries, validation, select_queries);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden action!"}]});
                break;
            case "DELETE":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin"){
                    try{
                        const {graduationprojects} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(graduationprojects, table_name);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}