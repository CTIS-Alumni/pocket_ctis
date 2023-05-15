import {doquery} from "../../../helpers/dbHelpers";
import {checkAuth} from "../../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {    const { society_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM studentsociety WHERE id = ?";
                const {data, errors} = await doquery({query: query,values: [society_id]});
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "PUT":
            try{
                const {society_name, description} = req.body.society;
                const query = "UPDATE studentsociety SET society_name = ?, description = ? WHERE id = ?";
                const data = await doquery({query: query,values: [society_name, description, society_id]});
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
                const query = "DELETE FROM studentsociety WHERE id = ?"
                const data = await doquery({query: query,values: [society_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
    }
    }else{
        res.redirect("/401", 401);
    }
}