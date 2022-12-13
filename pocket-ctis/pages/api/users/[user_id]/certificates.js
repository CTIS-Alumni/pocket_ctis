import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method) {
        case "GET":
            try {
                const certificate_query = "SELECT id, certificate_name, issuing_authority, visibility " +
                    "FROM usercertificate WHERE user_id = ? order by certificate_name asc";
                const certificate_info = await doquery({query: certificate_query, values: [user_id]});
                res.status(200).json({certificate_info});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {certificate_name, issuing_authority, visibility} = req.body.certificate;
                const post_certificate_query = "INSERT INTO usercertificate(user_id, certificate_name, issuing_authority ,visibility) values (?,?, ?, ?)";
                const data = await doquery({query: post_certificate_query, values: [user_id, certificate_name,issuing_authority, visibility]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}