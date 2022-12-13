import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch (method){
        case "GET":
            try{
                let id_param = "";
                let query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types', u.id, upp.profile_picture, upp.visibility, u.first_name, u.last_name " +
                    "FROM users u JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) ";

                if(req.query.project_id){
                    query += "WHERE u.graduation_project_id = ? ";
                    id_param =  req.query.project_id;
                }

                if(req.query.highschool_id){
                    query += "LEFT OUTER JOIN userhighschool uhs ON (uhs.user_id = u.id) WHERE uhs.high_school_id = ? ";
                    id_param = req.query.highschool_id;
                }

                if(req.query.wantsector_id){
                    query += "LEFT OUTER JOIN userwantsector uws ON (uws.user_id = u.id) WHERE uws.sector_id = ? ";
                    id_param = req.query.wantsector_id;
                }

                if(req.query.society_id){
                    query += "LEFT OUTER JOIN userstudentsociety uss ON (uss.user_id = u.id) WHERE uss.society_id = ? ";
                    id_param = req.query.society_id;
                }

                query += "GROUP BY uat.user_id order by u.first_name asc";

                const data = await doquery({query:query, values: [id_param]});
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