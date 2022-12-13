import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const society_query = "SELECT uss.id, ss.society_name, uss.activity_status, uss.visibility " +
                    "FROM userstudentsociety uss JOIN studentsociety ss ON (uss.society_id = ss.id) " +
                    "WHERE uss.user_id = ? order by ss.society_name asc";
                const society_info = await doquery({query: society_query, values: [user_id]});
                res.status(200).json({society_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {sector_id,visibility} = req.body.userwantsector;
                const post_user_want_sector_query = "INSERT INTO userwantsector(user_id,sector_id, visibility) values (?,?,?,?)";
                const data = await doquery({query: post_user_want_sector_query, values: [user_id,sector_id,visibility]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}