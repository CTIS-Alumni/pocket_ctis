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
                let values = [];
                    let query = "SElECT ei.id, ei.inst_name as 'edu_inst_name', ci.city_name, co.country_name, ei.is_erasmus " +
                    "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                //for erasmus page = showing only the universities which is for erasmus
                if(req.query.erasmus){ //for the erasmus page
                    query += "WHERE ei.is_erasmus = ? "
                    values.push(req.query.erasmus);
                }
                if(req.query.name){ //for the general search
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND ei.inst_name LIKE CONCAT('%', ?, '%') "
                    else query += "WHERE ei.inst_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                }
                if(req.query.location){ //TEST
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND ci.id = ? "
                    else query += "WHERE ci.id = ? ";
                    values.push(req.query.location);
                }

                query +="order by ei.inst_name asc";

                const data = await doquery({query:query, values: values});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;

        case "POST":{
            try{
                const {inst_name, city_id, is_erasmus} = req.body.erasmus;
                const query = "INSERT INTO company(inst_name, city_id, is_erasmus) values(?,?,?)";
                const data = await doquery({query: query, values: [inst_name, city_id, is_erasmus]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
        }
    }
}