import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    const { edu_inst_id } = req.query;
    switch(method){
        case "GET":
            try{
                const edu_record_query = "SELECT e.id, e.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name," +
                    "d.degree_name, e.name_of_program, start_date, e.end_date, e.visibility as 'record_visibility', e.is_current " +
                    "FROM educationrecord e JOIN users u ON (e.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = e.user_id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN degreetype d ON (e.degree_type_id = d.id) " +
                    "WHERE e.edu_inst_id = ? GROUP BY e.id order by e.record_date desc";

                //use user_id as link to user
                //use pic_visibility to see if pp should be shown or be default user pic, but, it will be deafult pic if the record_visibility is false anuwau
                //use record_visibility to see if name and surname should be anonymous, if record is invisible but pp is visible, make the pp default
                //record visibility overrides pp visibility

                const edu_records = await doquery({query: edu_record_query, values: [edu_inst_id]});
                res.status(200).json({edu_records});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}