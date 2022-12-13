import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { work_record_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const work_record_query = "SELECT id,company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current FROM workrecord WHERE id = ?";
                const work_record_info = await doquery({query: work_record_query, values: [work_record_id]});
                res.status(200).json({work_record_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current} = req.body.workrecord;
                const put_workrecord_query = "UPDATE workrecord SET company_id = ?, work_type_id = ?, department = ?, position = ?, work_description = ?, " +
                    "city_id = ?, start_date = ?, end_date = ?, visibility = ?, is_current = ? WHERE id = ?";
                const data = await doquery({query: put_workrecord_query,values: [company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current, work_record_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_workrecord_query = "DELETE FROM workrecord WHERE id = ?"
                const data = await doquery({query: delete_workrecord_query,values: [work_record_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}