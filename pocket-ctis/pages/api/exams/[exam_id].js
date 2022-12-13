import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const { exam_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const exam_query = "SELECT * FROM exam WHERE id = ?";
                const exam_info = await doquery({query: exam_query,values: [exam_id]});
                res.status(200).json({exam_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {exam_name} = req.body.exam;
                const put_exam_query = "UPDATE exam SET exam_name = ? WHERE id = ?";
                const data = await doquery({query: put_exam_query,values: [exam_name, exam_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_exam_query = "DELETE FROM exam WHERE id = ?";
                const data = await doquery({query:delete_exam_query,values: [exam_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }

}