import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_query = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                    "u.is_retired, u.profile_completion, u.graduation_project_id, g.project_name, u.is_active FROM users u " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "LEFT OUTER JOIN graduationproject g ON (u.graduation_project_id = g.id) " +
                    "WHERE u.id = ? GROUP BY u.id";

                const user_info = await doquery({query: user_query, values: [user_id]});
                res.status(200).json({user_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {is_retired, is_active, graduation_project_id,nee} = req.body.user;
                const put_user_query = "UPDATE users SET is_retired = ?, is_active = ?, graduation_project_id = ?, nee = ?  WHERE id = ?";
                const data = await doquery({query: put_user_query,values: [is_retired, is_active, graduation_project_id,nee, user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_user_query = "DELETE FROM users WHERE id = ?"
                const data = await doquery({query: delete_user_query,values: [user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}