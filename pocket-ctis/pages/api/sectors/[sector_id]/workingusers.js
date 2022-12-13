import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const {sector_id} = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_work_query = "SELECT w.id, w.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, w.company_id, c.company_name, w.visibility as 'record_visibility' " +
                    "FROM workrecord w JOIN users u ON (w.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (w.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN company c ON (w.company_id = c.id) " +
                    "JOIN sector s ON (c.sector_id = s.id) " +
                    "WHERE s.id = ?  AND w.is_current = true GROUP BY w.id order by u.first_name asc";

                //use user_id as link to user
                //use company_id as link to company
                //use user_visibility to see if pp should be shown or anonymous
                //use record_visibility to see if name and surname should be anonymous, if record is invisible but pp is visible, make the pp default
                //record visibility overrides pp visibility

                const user_working_list = await doquery({query: user_work_query, values: [sector_id]});
                res.status(200).json({user_working_list});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}