import {doquery} from "../../../helpers/dbHelpers";

export default async function handler(req, res){
    
    const { exam_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM exam WHERE id = ?";
                const data = await doquery({query: query,values: [exam_id]});
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
                const {exam_name} = req.body.exam;
                const query = "UPDATE exam SET exam_name = ? WHERE id = ?";
                const data = await doquery({query: query,values: [exam_name, exam_id]});
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
                const query = "DELETE FROM exam WHERE id = ?";
                const data = await doquery({query:query,values: [exam_id]});
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