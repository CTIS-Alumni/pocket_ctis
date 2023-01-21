import {doquery} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT i.id, c.company_name, i.semester, i.department, i.start_date, i.end_date, i.rating, i.opinion, i.visibility " +
                    "FROM internshiprecord i JOIN company c ON (i.company_id = c.id) " +
                    "WHERE i.user_id = ? order by i.start_date desc";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_id, semester, department, start_date, end_date} = req.body.internship;
                const query = "INSERT INTO internshiprecord(user_id, company_id, semester, department, start_date, end_date) values (?,?,?,?,?,?)";
                const data = await doquery({query: query, values: [user_id,company_id, semester, department, start_date, end_date]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}