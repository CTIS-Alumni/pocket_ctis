import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const career_obj_query = "SELECT id, career_objective, visibility FROM usercareerobjective WHERE user_id = ?";
                const career_obj_info = await doquery({query: career_obj_query, values: [user_id]});
                res.status(200).json({career_obj_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {career_objective, visibility} = req.body.careerobjective;
                const post_career_obj_query = "INSERT INTO usercareerobjective(user_id, career_objective, visibility) values (?, ?, ?)";
                const data = await doquery({query: post_career_obj_query, values: [user_id, career_objective, visibility]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {career_objective, visibility} = req.body.careerobjective;
                const put_career_obj_query = "UPDATE usercareerobjective SET career_objective = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: put_career_obj_query,values: [career_objective, visibility, user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_career_obj_query = "DELETE FROM usercareerobjective WHERE user_id = ?"
                const data = await doquery({query: delete_career_obj_query,values: [user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}