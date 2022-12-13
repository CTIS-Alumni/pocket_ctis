import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { sector_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const sector_query = "SELECT * FROM sector WHERE id = ?";
                const sector_info = await doquery({query: sector_query,values: [sector_id]});
                res.status(200).json({sector_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {sector_name} = req.body.sector;
                const put_sector_query = "UPDATE sector SET sector_name = ? WHERE id = ?";
                const data = await doquery({query: put_sector_query,values: [sector_name,sector_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_sector_query = "DELETE FROM sector WHERE id = ?";
                const data = await doquery({query: delete_sector_query,values: [sector_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}