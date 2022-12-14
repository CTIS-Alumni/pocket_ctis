import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { grad_project_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT g.id, g.project_name, g.team_number, g.product_name, g.project_year, g.semester, g.project_description, " +
                    "g.advisor, g.project_type, g.team_pic, g.poster_pic, g.company_id, c.company_name " +
                    "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) " +
                    "WHERE g.id = ?";
                //pics are under public/graduationprojects/,
                const data = await doquery({query: query,values: [grad_project_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
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
                res.status(500).json({error: error.message});
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
                res.status(500).json({error: error.message});
            }
            break;
    }

}