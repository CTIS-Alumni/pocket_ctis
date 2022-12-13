import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    const { company_id } = req.query;
    switch(method){
        case "GET":
            try{
                const work_record_query = "SELECT w.id, w.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, wt.type_name, w.department, " +
                    "w.position, w.work_description, ci.city_name, co.country_name, w.start_date, w.end_date, w.visibility as 'record_visibility', w.is_current " +
                    "FROM workrecord w JOIN users u ON (w.user_id = u.id) JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "JOIN userprofilepicture upp ON (w.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = w.user_id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE w.company_id = ? GROUP BY w.id order by record_date desc";

                //use user_id as link to user
                //use user_visibility to see if pp should be shown or anonymous
                //use record_visibility to see if name and surname should be anonymous, if record is invisible but pp is visible, make the pp default
                //record visibility overrides pp visibility

                const work_records = await doquery({query: work_record_query, values: [company_id]});
                res.status(200).json({work_records});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}