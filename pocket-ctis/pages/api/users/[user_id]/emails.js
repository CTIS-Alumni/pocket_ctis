import {
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT  id, email_address, visibility FROM useremail WHERE user_id = ? order by email_address asc";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const emails = JSON.parse(req.body);
                const base_query = "INSERT INTO useremail(user_id, email_address ";
                const base_values = ["user_id", "email_address"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(emails, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "useremail");
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const emails = JSON.parse(req.body);
                const base_query = "UPDATE useremail SET email_address = ?, ";
                const base_values = ["email_address"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(emails, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(errors){
                res.status(500).json({error: error.message});
            }break;
        case "DELETE":
            try{
                const emails = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM useremail WHERE id = ?";
                emails.forEach((e)=>{
                    queries.push({
                        name: e.id,
                        query: tempQuery,
                        values: [e.id]
                    });
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(errors){
                res.status(500).json({error: error.message});
            }
            break;
    }
}