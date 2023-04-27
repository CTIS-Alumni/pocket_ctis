import {doquery} from "../../helpers/dbHelpers";
import {sendPasswordResetMail} from "../../helpers/mailHelper";

export default async function handler(req, res) {
    if(req.query.forgotPassword){
        const {email, username} = JSON.parse(req.body);
        const query = "SELECT u.first_name, u.last_name, u.id, u.contact_email from users u " +
        "LEFT OUTER JOIN usercredential uc ON (uc.user_id = u.id)  WHERE u.contact_email = ? AND uc.username = ? ";
        try{
            const user = await doquery({query: query, values: [email, username]});
            if(user.hasOwnProperty("error"))
                res.status(500).json({error: user.error.message});
            if(user.length > 0){
                const mail_status = await sendPasswordResetMail(user[0]);
                if(mail_status === true)
                    res.status(200).json({message: "A password reset link has been sent to your mail address."});
                else res.status(500).json({error: "An error happened while sending email.", details: mail_status});
            }else{
                res.status(500).json({error: "Invalid mail address or username"});
            }
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }
}