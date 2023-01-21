import {doquery} from "../../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { work_record_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id,company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current FROM workrecord WHERE id = ?";
                const data = await doquery({query:query, values: [work_record_id]});
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
                const {company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current} = req.body.workrecord;
                const query = "UPDATE workrecord SET company_id = ?, work_type_id = ?, department = ?, position = ?, work_description = ?, " +
                    "city_id = ?, start_date = ?, end_date = ?, visibility = ?, is_current = ? WHERE id = ?";
                const data = await doquery({query: query,values: [company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current, work_record_id]});
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
                const query = "DELETE FROM workrecord WHERE id = ?"
                const data = await doquery({query: query,values: [work_record_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}