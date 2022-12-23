import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
        try{
            const query = "SELECT e.id, e.edu_inst_id, ei.inst_name, d.degree_name, e.name_of_program, e.start_date, e.end_date, e.visibility, e.is_current, " +
                "ci.city_name, co.country_name  " +
                "FROM educationrecord e " +
                "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id)  " +
                "JOIN degreetype d ON (e.degree_type_id = d.id)  " +
                "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                "WHERE e.user_id = ? order by e.start_date desc ";

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
                const {edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current} = req.body.educationrecord;
                const query = "INSERT INTO educationrecord(user_id, edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current) values (?,?, ?, ?, ?, ?, ?, ?)";
                const data = await doquery({query: query, values: [user_id,edu_inst_id, degree_type_id, name_of_program, start_date, end_date, visibility, is_current]});
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