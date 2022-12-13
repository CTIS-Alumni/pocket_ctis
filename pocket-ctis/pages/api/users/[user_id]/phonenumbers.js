import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const phone_query = "SELECT id, phone_number, visibility FROM userphone WHERE user_id = ?";
                const phone_info = await doquery({query: phone_query, values: [user_id]});
                res.status(200).json({phone_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {phone_number,visibility} = req.body.phone;
                const post_phone_query = "INSERT INTO userphone(user_id,phone_number, visibility) values (?,?,?)";
                const data = await doquery({query: post_phone_query, values: [user_id,phone_number,visibility]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
    }
}