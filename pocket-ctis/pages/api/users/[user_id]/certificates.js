import {
    doquery,
    doMultiQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries
} from "../../../../helpers/dbHelpers";

export default async function handler(req, res) {
    const api_key = req.headers['x-api-key'];
    if (api_key === undefined || api_key !== process.env.API_KEY) {
        res.status(401).json({message: "Unauthorized user!"});
    }
    const {user_id} = req.query;
    const method = req.method;
    switch (method) {
        case "GET":
            try {
                const query = "SELECT id, certificate_name, issuing_authority, visibility " +
                    "FROM usercertificate WHERE user_id = ? order by certificate_name asc";
                const data = await doquery({query: query, values: [user_id]});
                if (data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const certificates = JSON.parse(req.body);
                const base_query = "INSERT INTO usercertificate(user_id, certificate_name, issuing_authority ";
                const base_values = ["user_id", "certificate_name", "issuing_authority"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(certificates, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "usercertificate");
                res.status(200).json({data, errors});

            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try {
                const certificates = JSON.parse(req.body);
                const base_query = "UPDATE usercertificate SET certificate_name = ?, issuing_authority = ?, ";
                const base_values = ["certificate_name", "issuing_authority"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(certificates, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});

            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const certificates = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM usercertificate WHERE id = ?";
                certificates.forEach((cert)=>{
                   queries.push({
                       name: cert.id,
                       query: tempQuery,
                       values: [cert.id]
                   });
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});

            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}