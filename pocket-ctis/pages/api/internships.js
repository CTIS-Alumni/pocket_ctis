import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.query.key;
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method) {
        case "GET":
            try{
                const query = "SELECT i.id, i.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                    "i.company_id, i.department, c.company_name, i.semester, i.start_date, i.end_date, i.rating, i.opinion, i.visibility as 'record_visibility' " +
                    "FROM internshiprecord i JOIN users u on (i.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (i.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = i.user_id)  " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN company c ON (i.company_id = c.id) GROUP BY i.id order by i.record_date desc";

                //use user id and company id as links to their pages
                //use pic_visibility to see if pp should be shown or anonymous
                //use record_visibility to see if name and surname should be anonymous, if record is invisible but pp is visible, make the pp default pp anyway
                //record visibility overrides pp visibility
                const data = await doquery({query: query});
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