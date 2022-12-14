import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                let id_params = "";
                let query = "SELECT id, skill_name from SKILL ";

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