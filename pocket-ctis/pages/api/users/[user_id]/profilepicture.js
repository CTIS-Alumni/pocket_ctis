import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method) {
        case "GET":
            try {
                const query = "SELECT id, profile_picture, visibility FROM userprofilepicture WHERE user_id = ?";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {profile_picture, visibility} = req.body.profilepicture;
                const query = "UPDATE userprofilepicture SET profile_picture = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: query,values: [profile_picture, visibility, user_id]});
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