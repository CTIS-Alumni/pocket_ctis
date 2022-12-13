import {doquery} from "../../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_social_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_social_query = "SELECT id, social_media_id, link, visibility FROM usersocialmedia WHERE id = ?";
                const social_info = await doquery({query: user_social_query, values: [user_social_id]});
                res.status(200).json({social_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {social_media_id, link, visibility} = req.body.usersocialmedia;
                const put_user_social_query = "UPDATE usersocialmedia SET social_media_id = ?, link = ?, visibility = ? WHERE id = ?";
                const data = await doquery({query: put_user_social_query,values: [social_media_id, link, visibility, user_social_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_user_social_query = "DELETE FROM usersocialmedia WHERE id = ?"
                const data = await doquery({query: delete_user_social_query,values: [user_social_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}