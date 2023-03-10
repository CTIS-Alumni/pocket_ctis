import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch (method){
        case "GET":
            try{
                let values = [];
                let query = "select e.id, e.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, e.edu_inst_id, ei.edu_inst_name," +
                    "ci.city_name, co.country_name, d.degree_type_name, e.name_of_program, e.start_date, e.end_date, e.visibility as 'record_visibility', e.is_current, e.record_date " +
                    "FROM educationrecord e JOIN users u ON (e.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                    "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) " +
                    "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " +
                    "JOIN degreetype d ON (e.degree_type_id = d.id) " +
                    "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id)" +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) ";

                if(req.query.edu_inst_id){
                    query += "WHERE e.edu_inst_id = ? ";
                    values.push(req.query.edu_inst_id);
                }

                query +="GROUP BY e.id order by e.record_date desc";
                const data = await doquery({query:query, values: values});
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