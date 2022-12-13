import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { society_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const society_query = "SELECT * FROM studentsociety WHERE id = ?";
                const society_info = await doquery({query: society_query,values: [society_id]});
                res.status(200).json({society_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {society_name, description} = req.body.society;
                const put_society_query = "UPDATE studentsociety SET society_name = ?, description = ? WHERE id = ?";
                const data = await doquery({query: put_society_query,values: [society_name, description, society_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_society_query = "DELETE FROM studentsociety WHERE id = ?"
                const data = await doquery({query: delete_society_query,values: [society_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}