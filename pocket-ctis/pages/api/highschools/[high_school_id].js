import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { high_school_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const high_school_query = "SELECT h.id, h.high_school_name, ci.city_name, co.country_name "+
                    "FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE h.id = ?"
                const high_school_info = await doquery({query: high_school_query,values: [high_school_id]});
                res.status(200).json({high_school_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {high_school_name, city_id} = req.body.highschool;
                const put_high_school_query = "UPDATE highschool SET high_school_name = ?, city_id = ? WHERE id = ?";
                const data = await doquery({query: put_high_school_query,values: [high_school_name, city_id, high_school_id]});
                res.status(200).json({message: data });
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_high_school_query = "DELETE FROM highschool WHERE id = ?"
                const data = await doquery({query: delete_high_school_query,values: [high_school_id]});
                res.status(200).json({message: data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}