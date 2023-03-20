import {doquery} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "PUT":
                try {
                    const {profile_picture, visibility} = req.body.profilepicture;
                    const query = "UPDATE userprofilepicture SET profile_picture = ?, visibility = ? WHERE user_id = ?";
                    const data = await doquery({query: query, values: [profile_picture, visibility, user_id]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}