import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { userwantsector_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, sector_id, visibility FROM userwantsector WHERE id = ?";
                const data = await doquery({query: query, values: [userwantsector_id]});
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
                const {sector_id,  visibility} = req.body.userwantsector;
                const query = "UPDATE userwantsector SET sector_id = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query, values: [sector_id, visibility, userwantsector_id]});
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
                const query = "DELETE FROM userwantsector WHERE id = ?"
                const data = await doquery({query: query,values: [userwantsector_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}