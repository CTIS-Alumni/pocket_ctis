import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT uhs.id, hs.high_school_name, uhs.visibility FROM userhighschool uhs JOIN highschool hs ON (uhs.high_school_id = hs.id) " +
                    "WHERE uhs.user_id = ?";
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
                const {high_school_id, visibility} = req.body.highschool;
                const query = "INSERT INTO userhighschool(user_id, high_school_id, visibility) values (?, ?, ?)";
                const data = await doquery({query: query, values: [user_id, high_school_id, visibility]});
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
                const {high_school_id, visibility} = req.body.highschool;
                const query = "UPDATE userhighschool SET high_school_id = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: query,values: [high_school_id, visibility, user_id]});
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
                const query = "DELETE FROM userhighschool WHERE user_id = ?"
                const data = await doquery({query: query,values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}