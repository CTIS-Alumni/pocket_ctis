import {deleteCookie, verify} from "../../../helpers/jwtHelper";
import {doqueryNew} from "../../../helpers/dbHelpers";

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

        else if(payload.type === "forgotAdminPassword"){
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            res.redirect('/resetPassword?token='+token, 200);
        }

        else if(payload.type === "activateAccount") {
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            const user_id = payload.user_id;
            const query = "SELECT username FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
            const {data, errors} = await doqueryNew({query: query, values: [user_id]});

            if(errors || (data && data.length > 1))
                throw errors[0];

            if (data.length !== 0) { //if user already has credentials for this type of account
                res.redirect("/404", 404);
            } else {
                res.redirect('/activate?token=' + token, 200);
            }
        }

        else if(payload.type == "activateAdminAccount"){
            const refresh_expired = deleteCookie("RefreshJWT");           //logout the user just in case
            const access_expired = deleteCookie("AccessJWT");
            res.setHeader("Set-Cookie", [refresh_expired, access_expired]);

            const user_id = payload.user_id;
            const query = "SELECT username FROM usercredential WHERE user_id = ? AND is_admin_auth = 1 ";
            const {data, errors} = await doqueryNew({query: query, values: [user_id]});

            if(errors || (data && data.length > 1)){
                throw errors[0];
            }

            if (data.length !== 0) { //if user already has credentials for this type of account
                res.redirect("/404", 404);
            } else {
                res.redirect('/activate?token=' + token, 200);
            }
        }
        else if(payload.type == "changeEmail"){

            const {user_id, email_address} = payload
            const query = "UPDATE users SET contact_email = ? WHERE id = ?";
            const {data, errors} = await doqueryNew({query: query, values: [email_address, user_id]});


            if(errors || !data){
                res.redirect("/404", 404); //TODO: see if you should create an error page or send them to 404
            } else res.redirect("/confirmedMail?token=" + token, 200);

        } else res.redirect("/404", 404);

    }catch(error){
        res.redirect("/401", 401);
    }
}
