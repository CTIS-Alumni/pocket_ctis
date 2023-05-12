import {deleteCookie, verify} from "../../../helpers/jwtHelper";
import {doquery, doqueryNew} from "../../../helpers/dbHelpers";

export default async function handler(req,res){
    const {token} = req.query;
    try{
        const {payload} = await verify(token, process.env.MAIL_SECRET);

        if(payload.type === "forgotPassword"){
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            res.redirect('/resetPassword?token='+token, 200);
        }

        if(payload.type === "forgotAdminPassword"){
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            res.redirect('/resetPassword?token='+token, 200);
        }

        else if(payload.type === "activation") {
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            const user_id = payload.user_id;
            const query = "SELECT u.is_active, uc.username FROM users u LEFT OUTER JOIN usercredential uc " +
                "ON (u.id = uc.user_id) WHERE u.id = ? AND uc.is_admin_auth = 0 ";
            const {data, errors} = await doqueryNew({query: query, values: [user_id]});

            if(errors || (data && !data.length))
                throw errors[0];

            if (data.length !== 1 || data[0].is_active !== 0 || data[0].username !== null) { //if user
                res.redirect("/401", 401);
            } else {
                res.redirect('/activate?token=' + token, 200);
            }

        }
    }catch(error){
        res.redirect("/401", 401);
    }
}
