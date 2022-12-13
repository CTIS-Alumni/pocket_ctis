import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { education_record_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const edu_record_query = "SELECT id, edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current FROM educationrecord WHERE id = ?";
                const edu_record_info = await doquery({query: edu_record_query, values: [education_record_id]});
                res.status(200).json({edu_record_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current} = req.body.educationrecord;
                const put_educationrecord_query = "UPDATE educationrecord SET edu_inst_id = ?, degree_type_id = ?, name_of_program = ?, " +
                    "start_date = ?, end_date = ?, visibility = ?, is_current = ? WHERE id = ?";
                const data = await doquery({query: put_educationrecord_query,values: [edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current, education_record_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_educationrecord_query = "DELETE FROM educationrecord WHERE id = ?"
                const data = await doquery({query: delete_educationrecord_query,values: [education_record_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}