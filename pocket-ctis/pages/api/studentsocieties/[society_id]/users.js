import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    const { society_id } = req.query;
    switch(method){
        case "GET":
            try{
                const user_query = "SELECT uss.id, uss.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, uss.activity_status, uss.visibility as 'record_visibility' " +
                    "FROM userstudentsociety uss JOIN users u ON (uss.user_id = u.id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN userprofilepicture upp ON (uss.user_id = upp.user_id) " +
                    "WHERE uss.society_id = ? GROUP BY uss.id order by u.first_name asc";

                //use user_id as link to user
                //if record_visibility = false, make pic invisible even if its true
                //if record_visibility = true, see if pic is visible or not and show it accordingly

                const users = await doquery({query: user_query, values: [society_id]});
                res.status(200).json({users});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }

}