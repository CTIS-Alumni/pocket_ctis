import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { userwantsector_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_want_sector_query = "SELECT id, sector_id, visibility FROM userwantsector WHERE id = ?";
                const user_want_sector_info = await doquery({query: user_want_sector_query, values: [userwantsector_id]});
                res.status(200).json({user_want_sector_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {sector_id,  visibility} = req.body.userwantsector;
                const put_user_want_sector_query = "UPDATE userwantsector SET sector_id = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_user_want_sector_query,values: [sector_id, visibility, userwantsector_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_user_want_sector_query = "DELETE FROM userwantsector WHERE id = ?"
                const data = await doquery({query: delete_user_want_sector_query,values: [userwantsector_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}