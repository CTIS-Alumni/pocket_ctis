import {
    createGetQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';

const validation = async (data) => {
    if(data.link.trim() == "")
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    return true;
}

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
                const query = "SELECT usm.id, sm.social_media_name, usm.link, usm.visibility " +
                    "FROM usersocialmedia usm JOIN socialmedia sm ON (usm.social_media_id = sm.id) " +
                    "WHERE usm.user_id = ? order by sm.social_media_name asc ";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const socials = JSON.parse(req.body);
                const base_query = "INSERT INTO usersocialmedia(user_id, social_media_id, link ";
                const base_values = ["user_id", "social_media_id", "link"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(socials, base_query, base_values, optional_values, user_id);
                const select_queries = createGetQueries(socials, "usersocialmedia", ["social_media_id", "link"], user_id, true, true);
                const {data, errors} = await doMultiInsertQueries(queries, select_queries,"usersocialmedia", limitPerUser.social_media, validation);
                res.status(200).json({data, errors});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const socials = JSON.parse(req.body);
                const base_query = "UPDATE usersocialmedia SET social_media_id = :social_media_id, link = :link, ";
                const base_values = ["social_media_id", "link"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(socials, base_query, base_values, optional_values);
                const select_queries = createGetQueries(socials, "usersocialmedia", ["social_media_id", "link"], user_id, false, true);
                const {data, errors} = await doMultiQueries(queries, select_queries, validation);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
              const socials = JSON.parse(req.body);
              let queries = [];
              const tempQuery = "DELETE FROM usersocialmedia WHERE id = ?";
              socials.forEach((s)=>{
                  queries.push({
                     name: s.id,
                     query: tempQuery,
                     values: [s.id]
                  });
              });
              const {data, errors} = await doMultiQueries(queries);
              res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}