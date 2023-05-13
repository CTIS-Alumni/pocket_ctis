import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth} from "../../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
    const { sector_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM sector WHERE id = ?";
                const {data, errors} = await doqueryNew({query: query,values: [sector_id]});
                res.status(200).json({data: data[0] || null, errors});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "PUT":
            try{
                const {sector_name} = req.body.sector;
                const query = "UPDATE sector SET sector_name = ? WHERE id = ?";
                const data = await doquery({query: query,values: [sector_name,sector_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM sector WHERE id = ?";
                const data = await doquery({query: query,values: [sector_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
    }
    }else{
        res.redirect("/401", 401);
    }
}