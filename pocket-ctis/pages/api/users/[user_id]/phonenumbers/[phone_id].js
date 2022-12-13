import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { phone_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, phone_number, visibility FROM userphone WHERE id = ?";
                const data = await doquery({query:query, values: [phone_id]});
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
                const {phone_number, visibility} = req.body.phone;
                const query = "UPDATE userphone SET phone_number = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query,values: [phone_number, visibility, phone_id]});
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
                const query = "DELETE FROM userphone WHERE id = ?"
                const data = await doquery({query: query,values: [phone_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}