import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT e.id, e.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                    "e.edu_inst_id, ei.inst_name, e.semester, e.start_date, e.end_date, e.rating, e.opinion, e.visibility as 'record_visibility' " +
                    "FROM erasmusrecord e JOIN users u on (e.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = e.user_id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                    "GROUP BY e.id order by e.end_date desc;";

                //use ids as links to their pages
                const data = await doquery({query:query});
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