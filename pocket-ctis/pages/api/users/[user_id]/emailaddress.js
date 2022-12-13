import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const email_address_query = "SELECT  id, email_address, visibility FROM useremail WHERE user_id = ? order by email_address asc";
                const email_address_info = await doquery({query: email_address_query, values: [user_id]});
                res.status(200).json({email_address_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {email_address, visibility} = req.body.emailaddress;
                const post_email_query = "INSERT INTO useremail(user_id, email_address, visibility) values (?,?,?)";
                const data = await doquery({query: post_email_query, values: [user_id,email_address, visibility]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}