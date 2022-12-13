import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const social_query = "SELECT usm.id, sm.social_media_name, usm.link, usm.visibility " +
                    "FROM usersocialmedia usm JOIN socialmedia sm ON (usm.social_media_id = sm.id) " +
                    "WHERE usm.user_id = ? order by sm.social_media_name asc ";

                const social_info = await doquery({query: social_query, values: [user_id]});
                res.status(200).json({social_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {social_media_id,link,visibility} = req.body.usersocialmedia;
                const post_user_social_media_query = "INSERT INTO usersocialmedia(user_id,social_media_id,link, visibility) values (?,?,?,?)";
                const data = await doquery({query: post_user_social_media_query, values: [user_id,social_media_id,link,visibility]});
                res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}