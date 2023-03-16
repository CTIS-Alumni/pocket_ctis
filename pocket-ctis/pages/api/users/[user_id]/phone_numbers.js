import {
    createGetQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries, doMultiPutQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    if(data.phone_number.trim() == "")
        return false;
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
                const query = "SELECT id, phone_number, visibility FROM userphone WHERE user_id = ?";
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
                const phones = JSON.parse(req.body);
                const base_query = "INSERT INTO userphone(user_id, phone_number ";
                const base_values = ["user_id", "phone_number"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(phones,base_query, base_values, optional_values, user_id);
                const select_queries = createGetQueries(phones, "userphone", ["phone_number"], user_id, true, true);
                const {data, errors} = await doMultiInsertQueries(queries, select_queries,"userphone", limitPerUser.phone_numbers, validation);
                res.status(200).json({data, errors});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const phones = JSON.parse(req.body);
                const base_query = "UPDATE userphone SET phone_number = :phone_number, ";
                const base_values = ["phone_number"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(phones,base_query, base_values, optional_values);
                const select_queries = createGetQueries(phones, "userphone", ["phone_number"], user_id, false, true);
                const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const phones = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM userphone WHERE id = ?";
                phones.forEach((p)=>{
                   queries.push({
                      name:  p.id,
                       query: tempQuery,
                       values: [p.id]
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