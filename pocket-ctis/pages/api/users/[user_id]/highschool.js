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
                const query = "SELECT uhs.id, hs.high_school_name, uhs.visibility FROM userhighschool uhs JOIN highschool hs ON (uhs.high_school_id = hs.id) " +
                    "WHERE uhs.user_id = ?";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const high_schools = JSON.parse(req.body);
                const base_query = "INSERT INTO userhighschool(user_id, high_school_id ";
                const base_values = ["user_id", "high_school_id"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(high_schools, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "userhighschool");
                res.status(200).json({data, errors});

            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const high_schools = JSON.parse(req.body);
                const base_query = "UPDATE userhighschool SET high_school_id = ?, "
                const base_values = ["high_school_id"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(high_schools, base_query, base_values, optional_values);
               const {data, errors} = await doMultiQueries(queries);
               res.status(200).json({data, errors});

            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const high_schools = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE ighschool WHERE id = ?"
                high_schools.forEach((hs) => {
                    queries.push({
                        name: hs.id,
                        query: tempQuery,
                        values: [hs.id]
                    });
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});

            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}