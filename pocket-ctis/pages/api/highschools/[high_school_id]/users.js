import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { high_school_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_query = "SELECT uhs.id, uhs.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, uhs.visibility as 'record_visibility' " +
                    "FROM userhighschool uhs JOIN userprofilepicture upp ON(uhs.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = uhs.user_id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN users u ON (uhs.user_id = u.id)  " +
                    "WHERE uhs.high_school_id = ? GROUP BY uhs.id order by u.first_name asc";

                //use user_id as link to user
                //if record_visibility = false, make pic invisible even if its true
                //if record_visibility = true, see if pic is visible or not and show it accordingly

                const users = await doquery({query: user_query, values: [high_school_id]});
                res.status(200).json({users});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}