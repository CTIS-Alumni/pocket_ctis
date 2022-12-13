import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_exam_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_exam_query = "SELECT id, exam_id, grade, visibility FROM userexam WHERE id = ?";
                const exam_info = await doquery({query: user_exam_query, values: [user_exam_id]});
                res.status(200).json({exam_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {exam_id, grade, visibility} = req.body.userexam;
                const put_userexam_query = "UPDATE userexam SET exam_id = ?, grade = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_userexam_query,values: [exam_id, grade, visibility, user_exam_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_userexam_query = "DELETE FROM userexam WHERE id = ?"
                const data = await doquery({query: delete_userexam_query,values: [user_exam_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}