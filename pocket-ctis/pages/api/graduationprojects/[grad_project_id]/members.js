import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { grad_project_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const team_member_query = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name  \n" +
                    "FROM users u JOIN userprofilepicture upp ON (u.id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "WHERE graduation_project_id = ? GROUP BY u.id order by u.first_name asc";
                //use user_id as link to user
                //check visibility to see if you'll display the pp or make it default;

                const team_members = await doquery({query: team_member_query, values: [grad_project_id]});
                res.status(200).json({team_members});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }

}