import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { skill_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const skill_query = "SELECT * FROM skill WHERE id = ?";
                const skill_info = await doquery({query: skill_query,values: [skill_id]});
                res.status(200).json({skill_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {skill_name} = req.body.skill;
                const put_skill_query = "UPDATE skill SET skill_name = ? WHERE id = ?";
                const data = await doquery({query: put_skill_query,values: [skill_name,skill_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_skill_query = "DELETE FROM skill WHERE id = ?";
                const data = await doquery({query: delete_skill_query,values: [skill_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}