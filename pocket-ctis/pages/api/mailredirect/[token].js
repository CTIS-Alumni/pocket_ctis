import {verify} from "../../../helpers/jwtHelper";
import {doquery, doqueryNew} from "../../../helpers/dbHelpers";

export default async function handler(req,res){
    const {token} = req.query;
    try{
        const {payload} = await verify(token, process.env.MAIL_SECRET);

        if(payload.type === "forgotPassword")
            res.redirect('/resetPassword?token='+token, 200);

        else if(payload.type === "activation") {
            const user_id = payload.user_id;
            const query = "SELECT u.is_active, uc.username FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) WHERE u.id = ? ";
            const {data, errors} = await doqueryNew({query: query, values: [user_id]});

            if(errors)
                throw errors[0];

            if (data.length !== 1 || data[0].is_active !== 0 || data[0].username !== null) {
                res.redirect("/401", 401);
            } else {
                res.redirect('/activate?token=' + token, 200);
            }

        }
    }catch(error){
        res.redirect("/401", 401);
    }
}
