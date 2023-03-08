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
                const query = "SELECT uws.id, s.sector_name, uws.visibility " +
                    "FROM userwantsector uws JOIN sector s ON (uws.sector_id = s.id) " +
                    "WHERE uws.user_id = ? order by s.sector_name asc";
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
            try {
                const sectors = JSON.parse(req.body);
                const base_query = "INSERT INTO userwantsector(user_id, sector_id ";
                const base_values = ["user_id", "sector_id"];
                const optional_values = ["visibility"];
                const queries = createPostQueries(sectors, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "userwantsector");
                    res.status(200).json({data, errors});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const sectors = JSON.parse(req.body);
                const base_query = "UPDATE userwantsector SET sector_id = ?, ";
                const base_values = ["sector_id"];
                const optional_values = ["visibility"];
                const queries = createPutQueries(sectors, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const sectors = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM userwantsector WHERE id = ?";
                sectors.forEach((s) => {
                   queries.push({
                       name: s.id,
                       query: tempQuery,
                       values: [s.id]
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