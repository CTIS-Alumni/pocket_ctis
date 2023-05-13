import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth} from "../../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
    const { high_school_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT h.id, h.high_school_name, ci.city_name, co.country_name "+
                    "FROM highschool h LEFT OUTER JOIN city ci ON (h.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE h.id = ?"
                const {data, errors} = await doqueryNew({query: query,values: [high_school_id]});
                res.status(200).json({data: data[0] || errors});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "PUT":
            try{
                const {high_school_name, city_id} = req.body.highschool;
                const query = "UPDATE highschool SET high_school_name = ?, city_id = ? WHERE id = ?";
                const data = await doquery({query: query,values: [high_school_name, city_id, high_school_id]});
                res.status(200).json({message: data });
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM highschool WHERE id = ?"
                const data = await doquery({query: query,values: [high_school_id]});
                res.status(200).json({message: data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
    }
    }else{
        res.redirect("/401", 401);
    }
}