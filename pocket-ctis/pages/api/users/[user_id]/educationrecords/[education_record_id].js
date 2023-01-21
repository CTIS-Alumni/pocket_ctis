import {doquery} from "../../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { education_record_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current FROM educationrecord WHERE id = ?";
                const data = await doquery({query: query, values: [education_record_id]});
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
                const {edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current} = req.body.educationrecord;
                const query = "UPDATE educationrecord SET edu_inst_id = ?, degree_type_id = ?, name_of_program = ?, " +
                    "start_date = ?, end_date = ?, visibility = ?, is_current = ? WHERE id = ?";
                const data = await doquery({query: query,values: [edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current, education_record_id]});
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
                const query = "DELETE FROM educationrecord WHERE id = ?"
                const data = await doquery({query: query,values: [education_record_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}