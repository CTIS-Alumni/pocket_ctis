import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { certificate_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, certificate_name, issuing_authority, visibility FROM usercertificate WHERE id = ?";
                const data = await doquery({query: query, values: [certificate_id]});
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
                const {certificate_name,issuing_authority, visibility} = req.body.certificate;
                const query = "UPDATE usercertificate SET certificate_name = ?, issuing_authority = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query,values: [certificate_name,issuing_authority, visibility, certificate_id]});
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
                const query = "DELETE FROM usercertificate WHERE id = ?"
                const data = await doquery({query: query,values: [certificate_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}