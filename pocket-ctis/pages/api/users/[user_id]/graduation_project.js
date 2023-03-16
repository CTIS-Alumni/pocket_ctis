import {
    createPutQueries,
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
                const query = "SELECT ug.id, ug.graduation_project_id, g.graduation_project_name, ug.project_description, ug.visibility FROM usergraduationproject ug " +
                "LEFT OUTER JOIN graduationproject g ON (ug.project_id = g.id) " +
                "WHERE ug.user_id = ? ";

                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        /*case "POST":
            try{
                const graduation_project = JSON.parse(req.body);
                const base_query = "INSERT INTO usergraduationproject(user_id, exam_id, grade ";
                const base_values = ["user_id", "exam_id", "grade"];
                const optional_values = ["exam_date","visibility"];
                const queries = createPostQueries(exams, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "userexam");
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;*/
        case "PUT":
            try{
                const graduation_project = JSON.parse(req.body);
                const base_query = "UPDATE usergraduationproject SET ";
                const base_values = [];
                const optional_values = ["graduation_project_description","visibility"];
                const queries = createPutQueries(graduation_project, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries, true);
                res.status(200).json({data, errors, queries});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        /*case "DELETE":
            try{
                const exams = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM userexam WHERE id = ?";
                exams.forEach((record)=>{
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
            break;*/
    }
}