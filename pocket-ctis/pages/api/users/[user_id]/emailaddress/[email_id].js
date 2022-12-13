import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { email_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const email_address_query = "SELECT id, email_address, visibility FROM useremail WHERE id = ?";
                const email_address_info = await doquery({query:email_address_query, values: [email_id]});
                res.status(200).json({email_address_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
            case "PUT":
                try{
                    const {email_address, visibility} = req.body.emailaddress;
                    const put_email_address_query = "UPDATE useremail SET email_address = ?, visibility = ? WHERE id = ?";
                    const data = await doquery({query: put_email_address_query,values: [email_address, visibility, email_id]});
                    res.status(200).json({data});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
                break;
        case "DELETE":
            try{
                const delete_email_address_query = "DELETE FROM useremail WHERE id = ?"
                const data = await doquery({query: delete_email_address_query,values: [email_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}