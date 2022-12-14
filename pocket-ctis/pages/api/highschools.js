import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT h.id, h.high_school_name, ci.city_name, co.country_name " +
                    "FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) order by h.high_school_name asc";

                const data = await doquery({query:query});
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
                    const {high_school_name, city_id} = req.body.highschool;
                    const query = "INSERT INTO highschool(high_school_name, city_id) values(?,?)";
                    const data = await doquery({query: query, values: [high_school_name, city_id]});
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