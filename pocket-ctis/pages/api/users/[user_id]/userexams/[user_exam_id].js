import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_exam_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, exam_id, grade, visibility FROM userexam WHERE id = ?";
                const data = await doquery({query: query, values: [user_exam_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {exam_id, grade, visibility} = req.body.userexam;
                const query = "UPDATE userexam SET exam_id = ?, grade = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query,values: [exam_id, grade, visibility, user_exam_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM userexam WHERE id = ?"
                const data = await doquery({query: query,values: [user_exam_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}