import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { skill_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_skill_query = "SELECT id, skill_id, skill_level, visibility FROM userskill WHERE id = ?";
                const skill_info = await doquery({query: user_skill_query, values: [skill_id]});
                res.status(200).json({skill_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {skill_id, skill_level, visibility} = req.body.userskill;
                const put_user_skill_query = "UPDATE userskill SET skill_id = ?, skill_level = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_user_skill_query,values: [skill_id, skill_level, visibility, skill_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_user_skill_query = "DELETE FROM userskill WHERE id = ?"
                const data = await doquery({query: delete_user_skill_query,values: [skill_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}