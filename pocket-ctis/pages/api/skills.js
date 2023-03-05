import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method){
        case "GET":
            try{
                let id_params = "";
                let query = "SELECT s.id, s.skill_name, s.skill_type_id, st.type_name as 'skill_type_name' from skill s LEFT OUTER JOIN skilltype st ON (s.skill_type_id = st.id)";

                if(req.query.type_id){
                    query += "WHERE skill_type_id = ? ";
                    id_params = req.query.type_id;
                }
                query += "order by skill_name asc";

                const data = await doquery({query:query,values: [id_params]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {skill_name, skill_type_id} = req.body.skill;
                const query = "INSERT INTO skill(skill_name, skill_type_id) values (?, ?)"
                const data = await doquery({query: query, values: [skill_name, skill_type_id]});
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