import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const skill_query = "SELECT us.id, sk.skill_name, us.skill_level, skt.type_name, us.skill_level, us.visibility " +
                    "FROM userskill us JOIN skill sk ON (us.skill_id = sk.id) " +
                    "JOIN skilltype skt ON (sk.skill_type_id = skt.id) " +
                    "WHERE us.user_id = ? order by sk.skill_type_id asc ";

                const skill_info = await doquery({query: skill_query, values: [user_id]});
                res.status(200).json({skill_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {skill_id,skill_level,visibility} = req.body.userskill;
                const post_user_skill_query = "INSERT INTO userskill(user_id,skill_id,skill_level, visibility) values (?,?,?,?)";
                const data = await doquery({query: post_user_skill_query, values: [user_id,skill_id,skill_level,visibility]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
    }

}