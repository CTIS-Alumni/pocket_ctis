import {
    buildSearchQuery,
    doMultiQueries,
    deleteGraduationProjectsWithImage
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";

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
            case "DELETE":
                if(payload?.user === "admin"){
                    try{
                        const {graduationprojects} = JSON.parse(req.body);
                        const {data, errors} = await deleteGraduationProjectsWithImage(graduationprojects);
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
export default checkApiKey(handler);