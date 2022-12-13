import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "POST":
            try{
                const {skill_name, skill_type_id} = req.body.skill;
                const post_skill_query = "INSERT INTO skill(skill_name, skill_type_id) values (?, ?)"
                const data = await doquery({query: post_skill_query, values: [skill_name, skill_type_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}