import {doqueryNew} from "../../helpers/dbHelpers";
import {sendActivationMail, sendPasswordResetMail, sendProfileUpdateEmail} from "../../helpers/mailHelper";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    if(req.query.forgotPassword){
        try{
            const {email, username} = JSON.parse(req.body);
            const query = "SELECT u.first_name, u.last_name, u.id, u.contact_email from users u " +
                "LEFT OUTER JOIN usercredential uc ON (uc.user_id = u.id)  WHERE u.contact_email = ? AND uc.username = ? AND is_admin_auth = 0";

            const {data, errors} = await doqueryNew({query: query, values: [email, username]});
            if(data?.length){
                const mail_status = await sendPasswordResetMail(data[0], "forgotPassword");
                if(mail_status === true)
                    res.status(200).json({data: "A password reset link has been sent to your mail address."});
                else res.status(500).json({errors: [{error: "An error happened while sending email. Please try again.", details: mail_status}]});
            }else{
                res.status(500).json({errors: [{error: "Wrong username or email address!"}]});
            }
        }catch(err){
            res.status(500).json({errors: [{error: err.message}]});
        }
    }

    if(req.query.forgotAdminPassword){
        const session = await checkAuth(req.headers, res);
        if(session.payload.mode === "user"){
            try{
                const {email, username} = JSON.parse(req.body);
                const query = "SELECT u.first_name, u.last_name, u.id, u.contact_email from users u " +
                    "LEFT OUTER JOIN usercredential uc ON (uc.user_id = u.id)  WHERE u.contact_email = ? AND uc.username = ? AND is_admin_auth = 1";

                const {data, errors} = await doqueryNew({query: query, values: [email, username]});
                if(data?.length){
                    const mail_status = await sendPasswordResetMail(data[0], "forgotAdminPassword");
                    if(mail_status === true)
                        res.status(200).json({data: "A password reset link has been sent to your mail address."});
                    else res.status(500).json({errors: [{error: "An error happened while sending email. Please try again.", details: mail_status}]});
                }else{
                    res.status(500).json({errors: [{error: "Wrong username or email address!"}]});
                }
            }catch(err){
                res.status(500).json({errors: [{error: err.message}]});
            }
        }else res.status(403).json({errors: [{error: "Forbidden action!"}]});
    }

   else if(req.query.updateProfile) {
        const session = await checkAuth(req.headers, res);
        if (session.payload.mode === "admin") {
            try {
                const {user_id, type} = JSON.parse(req.body);
                let errors = [];
                const name_surname_query = "SELECT id, first_name, last_name, contact_email FROM users WHERE id = ? ";
                const result = await doqueryNew({query: name_surname_query, values: [user_id]});

                const mail_status = await sendProfileUpdateEmail(result.data[0], type);

                if (mail_status !== true) {
                    errors.push({
                        error: "Could not send profile update mail to user.",
                        details: mail_status
                    });
                }

                res.status(200).json({data: mail_status, errors: errors});
            } catch (error) {
                res.status(500).json({errors: [{error: error.message}]});
            }
        } res.status(403).json({errors: [{error: "Forbidden action!"}]});
    }

   else if(req.query.activateAccount) {
        const session = await checkAuth(req.headers, res);
        console.log("heres session", session);
        if (session.payload.mode === "admin") {
            try {
                const {user_id} = JSON.parse(req.body);
                let errors = [];
                const name_surname_query = "SELECT id, first_name, last_name, contact_email FROM users WHERE id = ? ";
                const result = await doqueryNew({query: name_surname_query, values: [user_id]});

                const mail_status = await sendActivationMail(result.data[0]);

                if (mail_status !== true) {
                    errors.push({
                        error: "Could not send account activation mail to user.",
                        details: mail_status
                    });
                }
                res.status(200).json({data: mail_status, errors: errors});
            } catch (error) {
                res.status(500).json({errors: [{error: error.message}]});
            }
        } res.status(403).json({errors: [{error: "Forbidden action!"}]});
    }
    else res.redirect("/401", 401);
}