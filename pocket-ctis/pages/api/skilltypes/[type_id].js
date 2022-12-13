import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { type_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM skilltype WHERE id = ?";
                const data = await doquery({query: query,values: [type_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {type_name} = req.body.skilltype;
                const query = "UPDATE skilltype SET type_name = ? WHERE id = ?";
                const data = await doquery({query: query,values: [type_name, type_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM skilltype WHERE id = ?"
                const data = await doquery({query: query,values: [type_id]});
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