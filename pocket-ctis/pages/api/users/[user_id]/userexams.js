import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const exam_query = "SELECT ue.id, ex.exam_name, ue.grade, ue.visibility " +
                    "FROM userexam ue JOIN exam ex ON (ue.exam_id = ex.id) " +
                    "WHERE ue.user_id = ? order by ex.exam_name asc";

                const exam_info = await doquery({query: exam_query, values: [user_id]});
                res.status(200).json({exam_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {exam_id, grade, visibility} = req.body.userexam;
                const post_exam_query = "INSERT INTO userexam(user_id, exam_id, grade,visibility) values (?, ?,?,?)";
                const data = await doquery({query: post_exam_query, values: [user_id,exam_id, grade, visibility]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}