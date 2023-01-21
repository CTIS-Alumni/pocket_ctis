import {doquery} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method) {
        case "GET":
            try {
                const query = "SELECT id, certificate_name, issuing_authority, visibility " +
                    "FROM usercertificate WHERE user_id = ? order by certificate_name asc";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {certificate_name, issuing_authority, visibility} = req.body.certificate;
                const query = "INSERT INTO usercertificate(user_id, certificate_name, issuing_authority ,visibility) values (?,?, ?, ?)";
                const data = await doquery({query: query, values: [user_id, certificate_name,issuing_authority, visibility]});
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