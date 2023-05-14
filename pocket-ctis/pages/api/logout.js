import {deleteCookie, sign, verify} from "../../helpers/jwtHelper";
import {parse, serialize} from "cookie";

const handler =  async (req, res) => {
    if(req.query.adminPanel){
        try{

            const {cookies} = req;
            if(cookies.RefreshJWT) {
                const {payload} = await verify(cookies.RefreshJWT, process.env.REFRESH_SECRET);

                const access_token = await sign({
                    user_id: payload.user_id,
                    mode: "user"
                }, process.env.ACCESS_SECRET, 60 * 10);

                const refresh_token = await sign({
                    user_id: payload.user_id,
                    mode: "user"
                }, process.env.REFRESH_SECRET, 60 * 60 * 24 * 3);

                const serialCookie = serialize("AccessJWT", access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 60 * 10,
                    path: "/"
                });

                const refreshCookie = serialize("RefreshJWT", refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 5,
                    path: "/"
                });

                res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                res.status(200).json({data: "Logged out successfully!"})
            }else res.status(403).json({errors: [{error: "You are not logged in as an admin."}]});
        }catch(error){
            res.status(500).json({errors: {error: error.message}});
        }
    }else{
        try{
            const {cookies} = req;

            if(cookies.RefreshJWT) {
                const refresh_expired = deleteCookie("RefreshJWT");
                const access_expired = deleteCookie("AccessJWT");
                res.setHeader("Set-Cookie", [refresh_expired, access_expired]);
                res.status(200).json({data: "Logged out successfully!"})
            }else res.status(403).json({errors: [{error: "You are not logged in."}]});
        }catch(error){
            res.status(500).json({errors: {error: error.message}});
        }
    }
}
