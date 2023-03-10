import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res) {
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch (method) {
        case "GET":
            try {//For displaying all work records
                let values = [];
                let query = "SELECT w.id, w.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, w.company_id,\n" +
                    "c.company_name, wt.work_type_name, w.department, w.position, w.work_description, w.city_id, ci.city_name," +
                    "w.country_id, co.country_name, w.start_date, w.end_date, w.visibility as 'record_visibility', w.is_current, w.record_date " +
                    "FROM workrecord w JOIN users u ON (w.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (w.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                    "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (w.country_id = co.id) ";

                if(req.query.company_id){
                    query += "WHERE w.company_id = ? ";
                    values.push(req.query.company_id);
                }

                if(req.query.worksector_id){
                    query += "WHERE c.sector_id = ? ";
                    values.push(req.query.worksector_id);
                }

                query +="GROUP BY w.id order by record_date desc";
                const data = await doquery({query:query, values: values});

                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
    }
}