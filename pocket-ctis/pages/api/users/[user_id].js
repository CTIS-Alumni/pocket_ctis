import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                    "u.is_retired, u.profile_completion, u.graduation_project_id, g.project_name, g.project_year, g.project_description, u.is_active FROM users u " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "LEFT OUTER JOIN graduationproject g ON (u.graduation_project_id = g.id) " +
                    "WHERE u.id = ? GROUP BY u.id";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {is_retired, is_active, graduation_project_id,nee} = req.body.user;
                const query = "UPDATE users SET is_retired = ?, is_active = ?, graduation_project_id = ?, nee = ?  WHERE id = ?";
                const data = await doquery({query: query,values: [is_retired, is_active, graduation_project_id,nee, user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM users WHERE id = ?"
                const data = await doquery({query: query,values: [user_id]});
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