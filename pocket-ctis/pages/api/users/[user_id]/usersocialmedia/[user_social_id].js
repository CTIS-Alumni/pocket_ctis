import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.query.key;
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_social_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT id, social_media_id, link, visibility FROM usersocialmedia WHERE id = ?";
                const data = await doquery({query: query, values: [user_social_id]});
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
                const {social_media_id, link, visibility} = req.body.usersocialmedia;
                const query = "UPDATE usersocialmedia SET social_media_id = ?, link = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: query,values: [social_media_id, link, visibility, user_social_id]});
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
                const query = "DELETE FROM usersocialmedia WHERE id = ?"
                const data = await doquery({query: query,values: [user_social_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}