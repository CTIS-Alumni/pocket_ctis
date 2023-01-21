import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "POST":
            try{
                const {career_objective, visibility} = req.body.careerobjective;
                const query = "INSERT INTO usercareerobjective(user_id, career_objective, visibility) values (?, ?, ?)";
                const data = await doquery({query: query, values: [user_id, career_objective, visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {career_objective, visibility} = req.body.careerobjective;
                const query = "UPDATE usercareerobjective SET career_objective = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: query,values: [career_objective, visibility, user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM usercareerobjective WHERE user_id = ?"
                const data = await doquery({query: query,values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}