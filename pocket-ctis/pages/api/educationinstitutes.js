import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    try{
        const query = "select ei.id, ei.inst_name, ci.city_name, co.country_name, ei.is_erasmus " +
            "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
            "LEFT OUTER JOIN country co ON (ci.country_id = co.id) order by ei.inst_name asc";

        const data = await doquery({query:query});
        res.status(200).json({data});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}