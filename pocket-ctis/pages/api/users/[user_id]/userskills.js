import {doquery} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT us.id, sk.skill_name, us.skill_level, skt.type_name, us.skill_level, us.visibility " +
                    "FROM userskill us JOIN skill sk ON (us.skill_id = sk.id) " +
                    "JOIN skilltype skt ON (sk.skill_type_id = skt.id) " +
                    "WHERE us.user_id = ? order by sk.skill_type_id asc ";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {skill_id,skill_level,visibility} = req.body.userskill;
                const query = "INSERT INTO userskill(user_id,skill_id,skill_level, visibility) values (?,?,?,?)";
                const data = await doquery({query: query, values: [user_id,skill_id,skill_level,visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
    }

}