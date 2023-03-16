import {
    createGetQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';

const validation = (data) => {
    if(data.project_name.trim() == "" || data.project_description.trim() == "")
        return false;
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    return true;
}

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
                const query = "SELECT id, project_name, project_description, visibility FROM userproject WHERE user_id = ? "
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
                const projects = JSON.parse(req.body);
                const base_query = "INSERT INTO userproject(user_id, project_name ";
                const base_values = ["user_id", "project_name"];
                const optional_values = ["project_description","visibility"];
                const queries = createPostQueries(projects, base_query, base_values, optional_values, user_id);
                const select_queries = createGetQueries(projects, "userproject", ["project_name", "project_description"], user_id, true);
                const {data, errors} = await doMultiInsertQueries(queries, select_queries, "userproject", limitPerUser.projects, validation);
                res.status(200).json({data, errors, queries});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const projects = JSON.parse(req.body);
                const base_query = "UPDATE userproject SET project_name = :project_name, ";
                const base_values = ["project_name"];
                const optional_values = ["project_description","visibility"];
                const queries = createPutQueries(projects, base_query, base_values, optional_values);
                const select_queries = createGetQueries(projects, "userproject", ["project_name", "project_description"], user_id, false);
                const {data, errors} = await doMultiQueries(queries, select_queries, validation);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const projects = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM userproject WHERE id = ?";
                projects.forEach((record)=>{
                    queries.push({
                        name: record.id,
                        query: tempQuery,
                        values: [record.id]
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