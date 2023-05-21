import {
    buildSearchQuery,
    doMultiQueries,
    deleteGraduationProjectsWithImage, buildInsertQueries, insertToTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {corsMiddleware} from "./middleware/cors";

const columns = {
    graduation_project_name: "g.graduation_project_name",
    company_name: "c.company_name",
    company_id: "c.id",
    advisor: "CONCAT(u.first_name, ' ', u.last_name) LIKE CONCAT('%', ?, '%') OR CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name)",
    project_year: "g.project_year",
    project_type: "g.project_type",
    id: "g.id",
    semester: "g.semester",
    team_number: "g.team_number",

}

const fields = {
    basic: ["graduation_project_name", "product_name", "company_id", "advisor_id", "project_year", "project_type", "semester", "team_number",
        "project_description"],
    date: []
}

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
        return "Supervisor ID must be a number!";
    if(!data.project_type)
        return "Project Type can't be empty!";
    if (data.project_type === "Company" && isNaN(parseInt(data.company_id)))
        return "Company projects must have a valid Company ID!";
    if (data.project_type !== "Company" && data.company_id !== null)
        return "Instructor or student projects can't have a Company ID!";
    return true;
}

const table_name = "graduationproject"

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                if(payload.user === "admin" || (payload.user !== "admin" && modules.graduation_projects.user_visible)){
                    try {
                        let values = [], length_values = [];
                        let query = "SELECT g.id, g.graduation_project_name, g.team_number, g.project_description, g.project_year, g.semester, g.team_pic, g.poster_pic, g.advisor_id, CONCAT(u.first_name, ' ' ,u.last_name) as advisor, g.project_type, g.company_id, c.company_name, " +
                            " ( SELECT GROUP_CONCAT(CONCAT(users.id,'-',users.first_name, ' ', users.last_name, '-', users.bilkent_id) SEPARATOR ', ') " +
                            "FROM users JOIN usergraduationproject ON users.id = usergraduationproject.user_id WHERE usergraduationproject.graduation_project_id = g.id ) AS team_members " +
                            "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) JOIN users u ON (u.id = g.advisor_id) ";
                        let length_query = "SELECT COUNT(*) as count from graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) " +
                            "JOIN users u ON (u.id = g.advisor_id) ";

                        if (req.query.name) {
                            query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                            length_query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                            length_values.push(req.query.name);
                            values.push(req.query.name);
                        }

                        if(req.query.searchcol)
                            query += " WHERE 1 = 1 ";

                        ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));


                        const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                            {name: "length", query: length_query, values: length_values}]);

                        res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(200).json({data: [], errors: []});
                break;
            case "POST":
                if(payload?.user === "admin"){
                    try{
                        const {graduationprojects} = JSON.parse(req.body);
                        const queries = buildInsertQueries(graduationprojects, table_name, fields)
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "DELETE":
                if(payload?.user === "admin"){
                    try{
                        const {graduationprojects} = JSON.parse(req.body);
                        const {data, errors} = await deleteGraduationProjectsWithImage(graduationprojects);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));