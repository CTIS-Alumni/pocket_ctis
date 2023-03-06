import {createPostQueries, createPutQueries, doMultiQueries, doquery} from "../../../../helpers/dbHelpers";

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
                const location = JSON.parse(req.body);
                const base_query = "INSERT INTO userlocation(user_id, country_id ";
                const base_values = ["user_id", "country_id"];
                const optional_values = ["city_id", "visibility"];
                const queries = createPostQueries(location, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const location = JSON.parse(req.body);
                const base_query = "UPDATE userlocation SET country_id = ?, ";
                const base_values = ["country_id"];
                const optional_values = ["city_id", "visibility"];
                const queries = createPutQueries(location, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const location = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM userlocation WHERE id = ?";
                location.forEach((loc) => {
                   queries.push({
                       name: loc.id,
                       query: tempQuery,
                       values: [loc.id]
                   });
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data,errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}