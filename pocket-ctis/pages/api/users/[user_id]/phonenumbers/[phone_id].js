import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { phone_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const phone_query = "SELECT id, phone_number, visibility FROM userphone WHERE id = ?";
                const phone_info = await doquery({query:phone_query, values: [phone_id]});
                res.status(200).json({phone_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {phone_number, visibility} = req.body.phone;
                const put_phone_query = "UPDATE userphone SET phone_number = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_phone_query,values: [phone_number, visibility, phone_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_phone_query = "DELETE FROM userphone WHERE id = ?"
                const data = await doquery({query: delete_phone_query,values: [phone_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}