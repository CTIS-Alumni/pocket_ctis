import nodemailer from 'nodemailer';
import mailConfig from '../config/mailConfig';
import {sign} from '../helpers/jwtHelper';
import {compile} from 'handlebars';

const fs = require('fs');
import departmentConfig from '../config/departmentConfig';


export const sendChangeEmailMail = async (user, newEmail) => {
    const transport = nodemailer.createTransport(mailConfig);
    try{
        const confirm_new_email_token = await sign({
            user_id: user.id, email_address: newEmail, type: "changeEmail"
        }, process.env.MAIL_SECRET, 60 * 10);


        const template = compile(fs.readFileSync('public/views/changeContactEmail.hbs', 'utf-8'));

        const html = template({
            name: user.first_name,
            surname: user.last_name,
            link: process.env.NEXT_PUBLIC_BACKEND_PATH + "/mailredirect/" + confirm_new_email_token
        })

        const options = {
            from: mailConfig.auth.user,
            to: newEmail,
            subject: `${departmentConfig.app_name} Contact Email Change Request`,
            html: html
        }

        await transport.sendMail(options);
        transport.close();
        return true;
    }catch(error){
        transport.close();
        return error;
    }
}

export const sendResolvedRequestMail = async (request) => {
    const transport = nodemailer.createTransport(mailConfig);

    try{
        const template = compile(fs.readFileSync('public/views/resolvedRequest.hbs', 'utf-8'));

        const html = template({
            name: request.first_name,
            surname: request.last_name,
            subject: request.subject,
            description: request.description
        })

        const options = {
            from: mailConfig.auth.user,
            to: request.contact_email,
            subject: `${departmentConfig.app_name} Resolved Request`,
            html: html
        }

        await transport.sendMail(options);
        transport.close();
        return true;

    }catch(error){
        transport.close();
        return error;
    }



}

export const sendPasswordResetMail = async (user, type) => {
    const transport = nodemailer.createTransport(mailConfig);
    try {
        const reset_pass_token = await sign({
            user_id: user.id, type: type
        }, process.env.MAIL_SECRET, 60 * 10);

        const template = compile(fs.readFileSync('public/views/forgotPassword.hbs', 'utf-8'));

        const html = template({
            name: user.first_name,
            surname: user.last_name,
            link: process.env.NEXT_PUBLIC_BACKEND_PATH + "/mailredirect/" + reset_pass_token
        })

        const options = {
            from: mailConfig.auth.user,
            to: user.contact_email,
            subject: `${departmentConfig.app_name} Password Reset Request`,
            html: html
        }

        if(type === "forgotAdminPassword")
            options.subject = `${departmentConfig.app_name} Admin Password Reset Request`;

        await transport.sendMail(options);
        transport.close();
        return true;
    } catch (err) {
        transport.close();
        return err;
    }
}



export const sendProfileUpdateEmail = async (user, type) => {
    const transport = nodemailer.createTransport({
        service: mailConfig.service,
        auth: mailConfig.auth,
        pool: true
    });

    const template = compile(fs.readFileSync('public/views/profileUpdate.hbs', 'utf-8'));

    try {
        const html = template({
            name: user.first_name,
            surname: user.last_name,
            type: type,
            link: process.env.NEXT_PUBLIC_ORIGIN_PATH + '/login'
        })


        const options = {
            from: mailConfig.auth.user,
            to: user.contact_email,
            subject: `${departmentConfig.app_name} Profile Update`,
            html: html
        }

        await transport.sendMail(options);
        transport.close();
        return true;
    } catch (err) {
        transport.close();
        return err;
    }
}

export const sendAdminActivationMail = async(user) => {
    const transport = nodemailer.createTransport({
        service: mailConfig.service,
        auth: mailConfig.auth,
        pool: true
    });

    const template = compile(fs.readFileSync('public/views/activateAdminAccount.hbs', 'utf-8'));

    try {
        const activation_token = await sign({user_id: user.id, type: "activateAdminAccount"},
            process.env.MAIL_SECRET, 60 * 60 * 24 * 30 * 6);

        const html = template({
            name: user.first_name,
            surname: user.last_name,
            app_name: departmentConfig.app_name,
            department: departmentConfig.department_name,
            link: process.env.NEXT_PUBLIC_BACKEND_PATH + "/mailredirect/" + activation_token
        });

        const options = {
            from: mailConfig.auth.user,
            to: user.contact_email,
            subject: `${departmentConfig.app_name} Account Activation`,
            html: html
        }

        await transport.sendMail(options);
        transport.close();
        return true;
    } catch (error) {
        transport.close();
        return error;
    }
}



export const sendActivationMail = async(user) => {
    const transport = nodemailer.createTransport({
        service: mailConfig.service,
        auth: mailConfig.auth,
        pool: true
    });

    const template = compile(fs.readFileSync('public/views/activateAccount.hbs', 'utf-8'));

    try {
        const activation_token = await sign({user_id: user.id, type: "activateAccount"},
            process.env.MAIL_SECRET, 60 * 60 * 24 * 30 * 6);

        const html = template({
            name: user.first_name,
            surname: user.last_name,
            app_name: departmentConfig.app_name,
            department: departmentConfig.department_name,
            link: process.env.NEXT_PUBLIC_BACKEND_PATH + "/mailredirect/" + activation_token
        });

        const options = {
            from: mailConfig.auth.user,
            to: user.contact_email,
            subject: `${departmentConfig.app_name} Account Activation`,
            html: html
        }

        await transport.sendMail(options);
        transport.close();
        return true;
    } catch (error) {
        transport.close();
        return error;
    }
}

