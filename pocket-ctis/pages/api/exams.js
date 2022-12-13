import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM exam order by exam_name asc";
                const data = await doquery({query:query});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
            case "POST":
                try{
                    const {exam_name} = req.body.exam;
                    const post_exam_query = "INSERT INTO exam(exam_name) values (?)";
                    const data = await doquery({query: post_exam_query, values: [exam_name]});
                    res.status(200).json({data});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
    }
}