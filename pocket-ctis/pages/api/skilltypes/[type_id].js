import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { type_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const skill_type_query = "SELECT * FROM skilltype WHERE id = ?";
                const skill_type_info = await doquery({query: skill_type_query,values: [type_id]});
                res.status(200).json({skill_type_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {type_name} = req.body.skilltype;
                const put_skill_type_query = "UPDATE skilltype SET type_name = ? WHERE id = ?";
                const data = await doquery({query: put_skill_type_query,values: [type_name, type_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_skill_type_query = "DELETE FROM skilltype WHERE id = ?"
                const data = await doquery({query: delete_skill_type_query,values: [type_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}