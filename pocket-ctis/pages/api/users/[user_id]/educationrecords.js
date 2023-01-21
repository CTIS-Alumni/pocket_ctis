import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
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