import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method) {
        case "GET":
            try {
                const pic_query = "SELECT id, profile_picture, visibility FROM userprofilepicture WHERE user_id = ?";
                const pic_info = await doquery({query: pic_query, values: [user_id]});
                res.status(200).json({pic_info});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {profile_picture, visibility} = req.body.profilepicture;
                const put_pic_query = "UPDATE userprofilepicture SET profile_picture = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: put_pic_query,values: [profile_picture, visibility, user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}