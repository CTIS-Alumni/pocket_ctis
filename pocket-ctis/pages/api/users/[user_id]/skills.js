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
                const query = "SELECT us.id, sk.skill_name, us.skill_level, skt.skill_type_name, us.skill_level, us.visibility " +
                    "FROM userskill us JOIN skill sk ON (us.skill_id = sk.id) " +
                    "JOIN skilltype skt ON (sk.skill_type_id = skt.id) " +
                    "WHERE us.user_id = ? order by sk.skill_type_id asc ";

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
                const skills = JSON.parse(req.body);
                const base_query = "INSERT INTO userskill(user_id, skill_id " ;
                const base_values = ["user_id", "skill_id"];
                const optional_values = ["skill_level", "visibility"];
                const queries = createPostQueries(skills, base_query, base_values, optional_values, user_id);
                const {data, errors} = await doMultiInsertQueries(queries, "userskill");
                res.status(200).json({data, errors});

            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const skills = JSON.parse(req.body);
                const base_query = "UPDATE userskill SET skill_id = ?, ";
                const base_values = ["skill_id"];
                const optional_values = ["skill_level", "visibility"];
                const queries = createPutQueries(skills, base_query, base_values, optional_values);
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const skills = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FRill WHERE id = ?";
                skills.forEach((skill)=>{
                    queries.push({
                        name: skill.id,
                        query: tempQuery,
                        values: [skill.id]
                    })
                });
                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(errors){
                res.status(500).json({error: error.message});
            }
            break;
    }

}