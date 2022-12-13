import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    let erasmus = req.query.erasmus;
    switch(method){
        case "GET":
            try{
                let query = "SElECT ei.id, ei.inst_name, ci.city_name, co.country_name, ei.is_erasmus " +
                    "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                //for erasmus page = showing only the universities which is for erasmus
                if(erasmus)
                    query += "WHERE ei.is_erasmus = ? ";
                else erasmus = "";

                query +="order by ei.inst_name asc";
                const data = await doquery({query:query, values: [erasmus]});
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