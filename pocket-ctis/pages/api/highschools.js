import {doquery} from "../../helpers/dbconnect";

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
                let query = "SELECT h.id, h.high_school_name, ci.city_name, co.country_name " +
                    "FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                if(req.query.name){
                    query += "WHERE h.high_school_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                }

                query += "order by h.high_school_name asc";

                const highschools = await doquery({query:query, values: values});
                if(highschools.hasOwnProperty("error"))
                    res.status(500).json({error: highschools.error.message});
                else
                    res.status(200).json({highschools});
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