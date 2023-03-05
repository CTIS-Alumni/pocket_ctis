import {doquery} from "../../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { email_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, email_address, visibility FROM useremail WHERE id = ?";
                const data = await doquery({query:query, values: [email_id]});
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
                    const {email_address, visibility} = req.body.emailaddress;
                    const query = "UPDATE useremail SET email_address = ?, visibility = ? WHERE id = ?";
                    const data = await doquery({query: query,values: [email_address, visibility, email_id]});
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
                const query = "DELETE FROM useremail WHERE id = ?"
                const data = await doquery({query: query,values: [email_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}