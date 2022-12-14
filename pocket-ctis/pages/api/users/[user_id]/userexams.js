import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT ue.id, ex.exam_name, ue.grade, ue.visibility " +
                    "FROM userexam ue JOIN exam ex ON (ue.exam_id = ex.id) " +
                    "WHERE ue.user_id = ? order by ex.exam_name asc";

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
                const {exam_id, grade, visibility} = req.body.userexam;
                const query = "INSERT INTO userexam(user_id, exam_id, grade,visibility) values (?, ?,?,?)";
                const data = await doquery({query: query, values: [user_id,exam_id, grade, visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}