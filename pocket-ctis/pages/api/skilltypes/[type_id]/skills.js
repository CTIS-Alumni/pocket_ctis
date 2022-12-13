import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    const { type_id } = req.query;
    switch(method){
        case "GET":
            try{
                const query = "select id, skill_name from skill where skill_type_id = ? order by skill_name asc";
                const data = await doquery({query:query,values: [type_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}