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
                const query = "SELECT id, type_name as 'skill_type_name' FROM skilltype order by type_name asc"; //for dropboxes
                const data = await doquery({query: query});
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
                const {type_name} = req.body.skilltype;
                const query = "INSERT INTO skilltype(type_name) values (?)"
                const data = await doquery({query: query, values: [type_name]});
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