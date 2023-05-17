import {doqueryNew} from "../../helpers/dbHelpers";
import {
    sendActivationMail,
    sendChangeEmailMail,
    sendPasswordResetMail,
    sendProfileUpdateEmail
} from "../../helpers/mailHelper";
import {checkAuth} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const handler =  async (req, res) => {
    if(req.query.changeEmail) {
        try {
            const session = await checkAuth(req.headers, res);

            if (!session)
                throw {message: "Unauthorized!"};

            const {email} = JSON.parse(req.body);

            const old_email_query = "SELECT u1.id AS id, u1.first_name, u1.last_name, u2.id AS existing_user_id FROM users AS u1 " +
                "LEFT JOIN users AS u2 ON u2.contact_email = ? WHERE u1.id = ?"
            const {data, errors} = await doqueryNew({query: old_email_query, values: [email, session.payload.user_id]});

            if (errors)
                throw {message: "An error occured while changing your email address"};

            if (data[0] && data[0].existing_user_id !== session.payload.user_id && data[0].existing_user_id !== null)
                throw {message: "This email address is taken by another user. Please enter a different email address!"}

            if (data[0] && data[0].existing_user_id === session.payload.user_id)
                throw {message: "New email address can't be the same as old email address!"};

            const mail_status = await sendChangeEmailMail(data[0], email);

            if (mail_status === true)
                res.status(200).json({data: mail_status, errors: errors});
            else res.status(500).json({
                errors: [{
                    error: "An error happened while sending email. Please try again.",
                    details: mail_status
                }]
            });
        } catch (error) {
            res.status(500).json({errors: [{error: error.message}]});
        }

    }if(req.query.forgotPassword){
        try{
            const {email, username} = JSON.parse(req.body);
            const query = "SELECT u.first_name, u.last_name, u.id, u.contact_email from users u " +
                "LEFT OUTER JOIN usercredential uc ON (uc.user_id = u.id)  WHERE u.contact_email = ? AND uc.username = ? AND is_admin_auth = 0";

            const {data, errors} = await doqueryNew({query: query, values: [email, username]});

            if(errors)
                throw {message: "An error occured. Please try again."};

            if(data && !data.length)
                throw {message: "Wrong username or email!"}

            const mail_status = await sendPasswordResetMail(data[0], "forgotPassword");
            if(mail_status === true)
                res.status(200).json({data: mail_status, errors: errors});
            else res.status(500).json({errors: [{error: "An error happened while sending email. Please try again.", details: mail_status}]});

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

                if(errors)
                    throw {message: "An error occured. Please try again."}

                if(data && !data.length)
                    throw {message: "Wrong username or email address!"}


                const mail_status = await sendPasswordResetMail(data[0], "forgotAdminPassword");
                if(mail_status === true)
                    res.status(200).json({data: mail_status, errors: errors});
                else res.status(500).json({errors: [{error: "An error happened while sending email. Please try again.", details: mail_status}]});

            }catch(err){
                res.status(500).json({errors: [{error: err.message}]});
            }
        }else res.status(401).json({errors: [{error: "Unauthorized!"}]});
    }

   else if(req.query.updateProfile) {
        const session = await checkAuth(req.headers, res);
        if (session.payload.mode === "admin") {
            try {
                const {user_id, type} = JSON.parse(req.body);
                const name_surname_query = "SELECT id, first_name, last_name, contact_email FROM users WHERE id = ? ";
                const {data, errors} = await doqueryNew({query: name_surname_query, values: [user_id]});

                if(errors || (data && !data.length))
                    throw {message: "An error occured while sending profile update email to user"};

                const mail_status = await sendProfileUpdateEmail(data[0], type);

                if(mail_status === true)
                    res.status(200).json({data: mail_status, errors: errors});
                else res.status(500).json({errors: [{error: "An error occured while sending profile update email to user", details: mail_status}]});

            } catch (error) {
                res.status(500).json({errors: [{error: error.message}]});
            }
        } res.status(403).json({errors: [{error: "Forbidden request!"}]});
    }

   else if(req.query.activateAccount) {
        const session = await checkAuth(req.headers, res);
        if (session.payload.mode === "admin") {
            try {
                const {user_id} = JSON.parse(req.body);
                const name_surname_query = "SELECT id, first_name, last_name, contact_email FROM users WHERE id = ? ";
                const {data, errors} = await doqueryNew({query: name_surname_query, values: [user_id]});

                if(errors || (data && !data.length))
                    throw {message: "An errror occured while sending activation mail to user"}

                const mail_status = await sendActivationMail(data[0]);

                if(mail_status == true)
                    res.status(200).json({data: mail_status, errors: errors});
                else res.status(500).json({errors: [{error: "An error occured while sending activation email to user", details: mail_status}]});

            } catch (error) {
                res.status(500).json({errors: [{error: error.message}]});
            }
        } res.status(401).json({errors: [{error: "Unauthorized!"}]});
    }
    else res.redirect("/401", 401);
}

export default checkApiKey(handler);
