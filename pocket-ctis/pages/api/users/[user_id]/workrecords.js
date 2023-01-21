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
                const query = "SELECT w.id, c.company_name, wt.type_name, w.department, w.position, w.work_description, ci.city_name, co.country_name, w.start_date, w.end_date, w.visibility, w.is_current " +
                    "FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                    "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE w.user_id = ? order by w.start_date desc";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current} = req.body.workrecord;
                const query = "INSERT INTO workrecord(user_id, company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current) values (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const data = await doquery({query: query, values: [user_id,company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}