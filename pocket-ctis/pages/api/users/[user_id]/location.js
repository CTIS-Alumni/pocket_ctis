import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const location_query = "SELECT ul.id, ul.city_id, ci.city_name, co.country_name, ul.visibility FROM userlocation ul JOIN city ci ON (ul.city_id = ci.id) " +
                    "JOIN country co ON (ci.country_id = co.id) WHERE ul.user_id = ?";
                const user_info = await doquery({query: location_query, values: [user_id]});
                res.status(200).json({user_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {city_id, visibility} = req.body.location;
                const post_location_query = "INSERT INTO userlocation(user_id, city_id, visibility) values (?,?,?)";
                const data = await doquery({query: post_location_query, values: [user_id,city_id, visibility]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {city_id, visibility} = req.body.location;
                const put_location_query = "UPDATE userlocation SET city_id = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: put_location_query,values: [city_id, visibility, user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_location_query = "DELETE FROM userlocation WHERE user_id = ?"
                const data = await doquery({query: delete_location_query,values: [user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}