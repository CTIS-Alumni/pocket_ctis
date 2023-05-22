import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth} from "../../../helpers/authHelper";
import {checkApiKey} from "../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
    const { grad_project_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT g.id, g.graduation_project_name, g.product_name, g.team_number, g.project_description, g.project_year, g.semester, g.team_pic, g.poster_pic, g.advisor_id, CONCAT(u.first_name, ' ' ,u.last_name) as advisor, g.project_type, g.company_id, c.company_name, " +
                    " ( SELECT GROUP_CONCAT(CONCAT(users.id,'-',users.first_name, ' ', users.last_name, '-', users.bilkent_id) SEPARATOR ', ') " +
                    "FROM users JOIN usergraduationproject ON users.id = usergraduationproject.user_id WHERE usergraduationproject.graduation_project_id = g.id ) AS team_members " +
                    "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) JOIN users u ON (u.id = g.advisor_id) WHERE g.id = ? ";

                const {data, errors} = await doqueryNew({query: query,values: [grad_project_id]});
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "PUT":
            try{
                const {project_name, team_number, product_name, project_year, semester, project_description, advisor, project_type, team_pic,
                poster_pic, company_id} = req.body.graduationproject;
                const query = "UPDATE graduationproject SET project_name = ?, team_number = ?, product_name = ?, " +
                    "project_year = ?, semester = ?, project_description = ?, advisor = ?, project_type = ?, team_pic = ?, " +
                    "poster_pic= ? , company_id = ? WHERE id = ?";

                const data = await doquery({query: query,values: [project_name, team_number, product_name,
                        project_year, semester, project_description, advisor, project_type, team_pic, poster_pic, company_id, grad_project_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM graduationproject WHERE id = ?";
                const data = await doquery({query:query,values: [grad_project_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
    }
    }else{
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);