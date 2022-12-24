import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res) {
    const method = req.method;
    switch (method) {
        case "GET":
            try {//For displaying all work records
                let values = [];
                let query = "SELECT w.id, w.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, w.company_id,\n" +
                    "c.company_name, wt.type_name, w.department, w.position, w.work_description, ci.city_name," +
                    "co.country_name, w.start_date, w.end_date, w.visibility as 'record_visibility', w.is_current, w.record_date " +
                    "FROM workrecord w JOIN users u ON (w.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (w.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                    "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                if(req.query.company_id){
                    query += "WHERE w.company_id = ? ";
                    values.push(req.query.company_id);
                }

                if(req.query.worksector_id){
                    query += "WHERE c.sector_id = ? ";
                    values.push(req.query.worksector_id);
                }

                query +="GROUP BY w.id order by record_date desc";
                const work = await doquery({query:query, values: values});

                //use user_id and company_id as links to their page
                //use user_types array to denote types with icon
                //use is_current to color some part of the record red or green to indicate if its current or not
                //use pic_visibility to see if pp should be shown or anonymous
                //use record_visibility to see if name and surname should be anonymous, if record is invisible but pp is visible, make the pp default pp anyway
                //record visibility overrides pp visibility
                //if the current session is admin, show the invisible ones as visible but indicate that they are actually invisible in some way
                //use profile pic before first name last name

                if(work.hasOwnProperty("error"))
                    res.status(500).json({error: work.error.message});
                else
                    res.status(200).json({work});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
    }
}