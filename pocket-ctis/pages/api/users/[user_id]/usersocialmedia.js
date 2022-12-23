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
                const query = "SELECT usm.id, sm.social_media_name, usm.link, usm.visibility " +
                    "FROM usersocialmedia usm JOIN socialmedia sm ON (usm.social_media_id = sm.id) " +
                    "WHERE usm.user_id = ? order by sm.social_media_name asc ";

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
            try {
                const {social_media_id,link,visibility} = req.body.usersocialmedia;
                const query = "INSERT INTO usersocialmedia(user_id,social_media_id,link, visibility) values (?,?,?,?)";
                const data = await doquery({query: query, values: [user_id,social_media_id,link,visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}