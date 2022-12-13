import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { internship_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, company_id, semester, department,  start_date, end_date, rating, opinions, visibility FROM internshiprecord WHERE id = ?";
                const data = await doquery({query:query, values: [internship_id]});
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
                const {company_id, semester, department,  start_date, end_date, rating,opinions, visibility} = req.body.internship;
                const query = "UPDATE internshiprecord SET company_id = ?,semester =?, department = ?,start_date = ?,end_date =? ,rating = ?, opinions = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query, values: [company_id,semester, department, start_date,end_date,rating, opinions, visibility, internship_id]});
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
                const query = "DELETE FROM internshiprecord WHERE id = ?"
                const data = await doquery({query: query,values: [internship_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}