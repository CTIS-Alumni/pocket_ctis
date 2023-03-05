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
                const query = "SELECT ul.id, ul.city_id, ci.city_name, ul.country_id, co.country_name, ul.visibility FROM userlocation ul " +
                    "LEFT OUTER JOIN city ci ON (ul.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (w.country_id = co.id) WHERE ul.user_id = ?";
                const data = await doquery({query: query, values: [user_id]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {city_id, visibility} = req.body.location;
                const query = "INSERT INTO userlocation(user_id, city_id, visibility) values (?,?,?)";
                const data = await doquery({query: query, values: [user_id,city_id, visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {city_id, visibility} = req.body.location;
                const query = "UPDATE userlocation SET city_id = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: query,values: [city_id, visibility, user_id]});
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
                const query = "DELETE FROM userlocation WHERE user_id = ?"
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