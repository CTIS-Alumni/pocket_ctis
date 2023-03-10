import {doquery} from "../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { edu_inst_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT ei.id, ei.edu_inst_name, ci.city_name, co.country_name, ei.is_erasmus, ei.rating " +
                    "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON(ci.country_id = co.id) WHERE ei.id = ?"
                //show that it is an erasmus uni
                //show its rating if 0 or higher
                //dont show if null

                const data = await doquery({query: query, values: [edu_inst_id]});
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
                const {inst_name, city_id, is_erasmus} = req.body.educationinstitute;
                const query = "UPDATE educationinstitute SET edu_inst_name = ?, city_id = ?, is_erasmus = ? WHERE id = ?"
                const data = await doquery({query: query,values: [inst_name, city_id, is_erasmus, edu_inst_id]});
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
                const query = "DELETE FROM educationinstitute WHERE id = ?"
                const data = await doquery({query: query,values: [edu_inst_id]});
                res.status(200).json({message: data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}