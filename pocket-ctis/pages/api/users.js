import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch (method){
        case "GET":
            try{
                let values = [];
                let query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types', u.id, upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name ";

                if(req.query.highschool_id)
                    query += ",uhs.visibility as 'highschool_visibility' ";
                if(req.query.wantsector_id)
                    query += ",uws.visibility as 'wantsector_visibility' ";
                if(req.query.society_id)
                    query += ",uss.visibility as 'society_visibility'";

                    query += "FROM users u JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) ";

                if(req.query.highschool_id){
                    query += "LEFT OUTER JOIN userhighschool uhs ON (uhs.user_id = u.id) WHERE uhs.high_school_id = ? ";
                    values.push(req.query.highschool_id);
                }

                if(req.query.wantsector_id){ //for a specific sectors page
                    query += "LEFT OUTER JOIN userwantsector uws ON (uws.user_id = u.id) WHERE uws.sector_id = ? ";
                    values.push(req.query.wantsector_id);
                }

                if(req.query.society_id){
                    query += "LEFT OUTER JOIN userstudentsociety uss ON (uss.user_id = u.id) WHERE uss.society_id = ? ";
                    values.push(req.query.society_id);
                }

                if(req.query.project_id){
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND u.graduation_project_id = ? ";
                    else query += "WHERE u.graduation_project_id = ? ";
                    values.push(req.query.project_id);
                }

                if(req.query.name){ //for general search
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND u.first_name LIKE CONCAT('%', ?, '%') OR u.last_name LIKE CONCAT('%', ?, '%')";
                    else query += "WHERE (u.first_name LIKE CONCAT('%', ?, '%') OR u.last_name LIKE CONCAT('%', ?, '%'))";
                    values.push(req.query.name);
                    values.push(req.query.name);
                }

                query += "GROUP BY uat.user_id order by u.first_name asc";

                const users = await doquery({query:query, values: values});
                if(users.hasOwnProperty("error"))
                    res.status(500).json({error: users.error.message});
                else
                    res.status(200).json({users});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}