import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { country_id } = req.query;

    try{
        const query = "select id, city_name from city where country_id = ? order by city_name asc";

        const data = await doquery({query: query,values: [country_id]});
        res.status(200).json({data});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}