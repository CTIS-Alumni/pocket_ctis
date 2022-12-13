import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { certificate_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const certificate_query = "SELECT id, certificate_name, issuing_authority, visibility FROM usercertificate WHERE id = ?";
                const certificate_info = await doquery({query: certificate_query, values: [certificate_id]});
                res.status(200).json({certificate_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {certificate_name,issuing_authority, visibility} = req.body.certificate;
                const put_certificate_query = "UPDATE usercertificate SET certificate_name = ?, issuing_authority = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_certificate_query,values: [certificate_name,issuing_authority, visibility, certificate_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_certificate_query = "DELETE FROM usercertificate WHERE id = ?"
                const data = await doquery({query: delete_certificate_query,values: [certificate_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}