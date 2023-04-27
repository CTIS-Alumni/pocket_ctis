import nodemailer from 'nodemailer';
import mail_config from '../config/mail_config';
import {sign} from '../helpers/jwtHelper';

export const sendPasswordResetMail = async (user) => {
    try{
        const reset_pass_token = await sign({user_id: user.id, type: "forgotPassword"
        }, process.env.RESET_PASS_SECRET, 60*5);

        const transport = nodemailer.createTransport(mail_config);

        const html_template =
            `<div>${user.first_name} ${user.last_name},
            <br/>Please click the link below to reset your password. <br/> 
            <a>${process.env.NEXT_PUBLIC_BACKEND_PATH}/mailRedirect/${reset_pass_token}</a> 
            <br/>This link will expire in 5 minutes. </div>`

        const options = {
            from: mail_config.auth.user,
            to: user.contact_email,
            subject: "PocketCTIS Password Reset",
            text: "We have received your password reset request",
            html: html_template
        }

        await transport.sendMail(options);
        return true;
    }catch(err){
        return err;
    }
}

