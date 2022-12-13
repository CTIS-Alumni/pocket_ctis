import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    try{
        const query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types', u.id, upp.profile_picture, upp.visibility, u.first_name, u.last_name " +
            "FROM users u JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
            "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
            "JOIN accounttype act ON (act.id = uat.type_id) " +
            "GROUP BY uat.user_id order by u.first_name asc";

        const data = await doquery({query:query});
        res.status(200).json({data});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}