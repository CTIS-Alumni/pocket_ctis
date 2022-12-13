import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const record_query = "SELECT i.id, i.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                    "i.company_id, i.department, c.company_name, i.semester, i.start_date, i.end_date, i.rating, i.opinion, i.visibility as 'record_visibility' " +
                    "FROM internshiprecord i JOIN users u on (i.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (i.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = i.user_id)  " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN company c ON (i.company_id = c.id) GROUP BY i.id order by i.end_date desc";

                //use ids as links to their pages
                const records = await doquery({query:record_query});
                res.status(200).json({records});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}