import {
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import { verify} from "../../../../helpers/jwtHelper";

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    if(data.career_objective.trim() == "")
        return false;
    return true;
}

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    const {cookies} = req;
    const jwt = cookies.PocketCTISJWT;
    try{
        const session = await verify(jwt, process.env.ACCESS_SECRET);
        session.payload.user_id
        res.status(500).json({cookies: cookies, jwt: jwt, info: session_info});
    }catch(error){
        res.status(500).json({cookies: cookies, jwt: jwt, info: session_info, error: error.message});
    }

    res.status(200).json({cookies: cookies, jwt: jwt, info: session_info});
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({error: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, career_objective, visibility FROM usercareerobjective WHERE user_id = ?";
                const data = await doquery({query: query, values: [user_id]});
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
                const career = JSON.parse(req.body);
                const base_query = "INSERT INTO usercareerobjective(user_id, career_objective ";
                const base_values = ["user_id", "career_objective"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(career, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, [], "usercareerobjective", 0, validation );
                res.status(200).json({data, errors, queries});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const career = JSON.parse(req.body);
                const base_query = "UPDATE usercareerobjective SET career_objective = :career_objective, ";
                const base_values = ["career_objective"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(career, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries, true);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const career = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM usercareerobjective WHERE id = ?";
                career.forEach((c)=>{
                    queries.push({
                       name: c.id,
                       query: tempQuery,
                       values: [c.id]
                    });
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}