import {doquery, doqueryNew} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "PUT":
                try {
                    if(req.query.removePic){
                        const query = "UPDATE userprofilepicture SET userprofilepicture = 'defaultuser' WHERE user_id = ?";
                        const {data, errors} = await doqueryNew({query: query, values: [payload.user_id]});
                        if(errors || (data && !data.length))
                            throw errors[0];
                        
                        res.status(200).json({data, errors});
                    }
                    const {profile_picture} = req.body.profilepicture;
                    const query = "UPDATE userprofilepicture SET profile_picture = ?, visibility = ? WHERE user_id = ?";
                    const {data, errors} = await doqueryNew({query: query, values: [profile_picture.file, profile_picture.visibility, payload.user_id]});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    } res.status(403).json({errors: [{error: "Forbidden request!"}]});
}