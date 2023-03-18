import {doquery} from "../../../helpers/dbHelpers";

export default async function handler(req, res){
    
    const method = req.method;
    const { type_id } = req.query;
    switch(method){
        case "PUT":
            try{
                const {degree_name} = req.body.degreetype;
                const query = "UPDATE degreetype SET degree_type_name = ? WHERE id = ?"
                const data = await doquery({query: query,values: [degree_name,type_id]});
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
                const query = "DELETE FROM degreetypes WHERE id = ?"
                const data = await doquery({query: query,values: [degree_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }

}