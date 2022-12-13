import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { internship_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const internship_query = "SELECT id, company_id, semester, department,  start_date, end_date, rating, opinions, visibility FROM internshiprecord WHERE id = ?";
                const internship_info = await doquery({query:internship_query, values: [internship_id]});
                res.status(200).json({internship_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {company_id, semester, department,  start_date, end_date, rating,opinions, visibility} = req.body.internship;
                const put_internship_query = "UPDATE internshiprecord SET company_id = ?,semester =?, department = ?,start_date = ?,end_date =? ,rating = ?, opinions = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_internship_query, values: [company_id,semester, department, start_date,end_date,rating, opinions, visibility, internship_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_internship_query = "DELETE FROM internshiprecord WHERE id = ?"
                const data = await doquery({query: delete_internship_query,values: [internship_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}