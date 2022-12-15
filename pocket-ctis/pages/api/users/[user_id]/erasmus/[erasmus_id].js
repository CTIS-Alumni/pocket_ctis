import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { erasmus_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, edu_inst_id, semester, start_date, end_date, rating, opinion, visibility FROM erasmusrecord WHERE id = ?";
                const data = await doquery({query:query, values: [erasmus_id]});
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
                const {edu_inst_id, semester, start_date, end_date, rating,opinion, visibility} = req.body.erasmus;
                const query = "UPDATE erasmusrecord SET edu_inst_id = ?,semester =?,start_date = ?,end_date =? ,rating = ?, opinion = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query, values: [edu_inst_id,semester,start_date,end_date,rating, opinion, visibility, erasmus_id]});
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
                const query = "DELETE FROM erasmusrecord WHERE id = ?"
                const data = await doquery({query: query,values: [erasmus_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}