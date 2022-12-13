import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { erasmus_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const erasmus_query = "SELECT id, edu_inst_id, semester, start_date, end_date, rating, opinion, visibility FROM erasmusrecord WHERE id = ?";
                const erasmus_info = await doquery({query:erasmus_query, values: [erasmus_id]});
                res.status(200).json({erasmus_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {edu_inst_id, semester, start_date, end_date, rating,opinion, visibility} = req.body.erasmus;
                const put_erasmus_query = "UPDATE erasmusrecord SET edu_inst_id = ?,semester =?,start_date = ?,end_date =? ,rating = ?, opinion = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_erasmus_query, values: [edu_inst_id,semester,start_date,end_date,rating, opinion, visibility, erasmus_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_erasmus_query = "DELETE FROM erasmusrecord WHERE id = ?"
                const data = await doquery({query: delete_erasmus_query,values: [erasmus_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}