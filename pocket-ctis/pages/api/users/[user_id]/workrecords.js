import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const work_query = "SELECT w.id, c.company_name, wt.type_name, w.department, w.position, w.work_description, ci.city_name, co.country_name, w.start_date, w.end_date, w.visibility, w.is_current " +
                    "FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                    "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE w.user_id = ? order by w.start_date desc";

                const work_info = await doquery({query: work_query, values: [user_id]});
                res.status(200).json({work_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current} = req.body.workrecord;
                const post_workrecord_query = "INSERT INTO workrecord(user_id, company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current) values (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const data = await doquery({query: post_workrecord_query, values: [user_id,company_id, work_type_id, department, position, work_description, city_id, start_date, end_date, visibility, is_current]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}