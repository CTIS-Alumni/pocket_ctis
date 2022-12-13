import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT g.id, g.project_name, g.team_number, g.project_year, g.semester, g.advisor, g.project_type, g.company_id, c.company_name " +
                    "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) order by g.project_year";

                const data = await doquery({query: query});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {project_name, team_number, product_name, project_year, semester, project_description, advisor, project_type, team_pic,
                    poster_pic, company_id} = req.body.graduationproject;
                const post_grad_project_query = "INSERT INTO graduationproject(project_name, team_number, product_name, project_year, " +
                    "semester, project_description, advisor, project_type, team_pic, poster_pic, company_id) values(?,?,?,?,?,?,?,?,?,?,?)";
                const data = await doquery({query: post_grad_project_query, values: [project_name, team_number, product_name,
                        project_year, semester, project_description, advisor, project_type, team_pic, poster_pic, company_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}