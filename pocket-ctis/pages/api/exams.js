import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM exam order by exam_name asc";
                const data = await doquery({query:query});
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
                    const {exam_name} = req.body.exam;
                    const query = "INSERT INTO exam(exam_name) values (?)";
                    const data = await doquery({query: query, values: [exam_name]});
                    if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
    }
}