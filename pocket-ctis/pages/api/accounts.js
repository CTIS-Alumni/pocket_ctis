import {verify} from "../../helpers/jwtHelper";
import {compare, hash} from "bcrypt";
import {doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {corsMiddleware} from "./middleware/cors";
import {checkApiKey} from "./middleware/checkAPIkey";

const handleErrorMessages = (error) => {
    if(error?.code?.includes("ERR_JWT_EXPIRED"))
        return {message: "Expired link!"};
    if(error.includes("timestamp check"))
        return {message: "Expired link!"};
    if(error.includes("Duplicate"))
        return {message: "Email is taken by another user!"}
    return error;
}

const handler = async (req, res) => {
    if(req.query.changeEmail){
        try{
            const {username, password, token} = JSON.parse(req.body);
            const {payload} = await verify(token, process.env.MAIL_SECRET);

            const check_credentials_query = "SELECT hashed FROM usercredential WHERE user_id = ?  AND username = ? AND is_admin_auth = 0 ";
            const {data, errors} = await doqueryNew({query: check_credentials_query, values: [payload.user_id, username]});

            if(errors || (data && !data.length))
                throw {message: "Username or password is wrong!"};

            const compare_res = await compare(password, data[0].hashed);
            if(!compare_res)
                throw {message: "Username or password is wrong!"};

            const change_email_query = "UPDATE users SET contact_email = ? WHERE id = ? ";
            const {data: d, errors: err} = await doqueryNew({query: change_email_query, values: [payload.email_address, payload.user_id]});

            res.status(200).json({data:d, errors:err});

        }catch(error){
            if(!error.message)
                error = handleErrorMessages(error);
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else if(req.query.changePassword){
        try{
            const session = await checkAuth(req.headers, res);
            if(session.payload.mode === "user"){
                const {current, newPass} = JSON.parse(req.body);

                if(current === newPass)
                    throw {message: "Old password can't be the same as new password!"};

                const check_credentials_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
                const {data, errors} = await doqueryNew({query: check_credentials_query, values: [session.payload.user_id]});

                if(errors || (data && !data.length))
                    throw {message: "An error occured while resetting your password"};


                const compare_res = await compare(current, data[0].hashed);
                if(!compare_res)
                    throw {message: "Current password is wrong!"};

                const new_hashed_pass = await hash(newPass, 10);
                const insert_new_admin_pass_query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 0 ";
                const {data:d, errors:err} = await doqueryNew({query: insert_new_admin_pass_query, values: [new_hashed_pass, session.payload.user_id]});

                res.status(200).json({data:d, errors:err});
            }else res.status(401).json({errors: [{error: "Unauhtorized!"}]});
        }catch(error){
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else if(req.query.changeAdminPassword){
        try{
            const session = await checkAuth(req.headers, res);
            const payload = await checkUserType(session, req.query);
            if(payload?.user === "admin") {

                const {current, newPass} = JSON.parse(req.body);

                if(current === newPass)
                    throw {message: "Old password can't be the same as new password!"};

                const check_credentials_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 1 ";
                const {data, errors} = await doqueryNew({query: check_credentials_query, values: [payload.user_id]});

                if(errors || (data && !data.length))
                    throw {message: "An error occured while resetting your password"};


                const compare_res = await compare(current, data[0].hashed);
                if(!compare_res)
                    throw {message: "Current password is wrong!"};

                const new_hashed_pass = await hash(newPass, 10);
                const insert_new_admin_pass_query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 1 ";
                const {data:d, errors:err} = await doqueryNew({query: insert_new_admin_pass_query, values: [new_hashed_pass, payload.user_id]});

                res.status(200).json({data:d, errors:err});

            }else res.status(401).json({errors: [{error: "Unauhtorized!"}]});
        }catch(error){
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else if(req.query.activateAccount){
        try{
            const {username, password, token} = JSON.parse(req.body);

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const check_credentials_query = "SELECT username FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
            const result = await doqueryNew({query: check_credentials_query, values: [payload.user_id]});

            if(result.errors)
                throw {message: result.errors[0].error}
            else if(result.data && result.data.length > 1)
                throw {message: "Your admin account has already been activated!"};

            const query = "INSERT INTO usercredential (user_id, hashed, username, is_admin_auth) values (?, ?, ?, 0) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});

            if(data){
                const activate_query = "UPDATE users SET is_active = 1 WHERE id = ? ";
                const {data: d, errors: err} = await doqueryNew({query: activate_query, values: [payload.user_id]});
                res.status(200).json({data: d,errors: err})
            }
            else {
                errors[0].error = handleErrorMessages(errors[0].error);
                res.status(500).json({errors})
            }

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]})
        }
    }
    else if(req.query.activateAdminAccount){
        try{
            const {username, password, token} = JSON.parse(req.body);

            const {payload} = await verify(token, process.env.MAIL_SECRET);

            const check_credentials_query = "SELECT username FROM usercredential WHERE user_id = ? AND is_admin_auth = 1 ";
            const result = await doqueryNew({query: check_credentials_query, values: [payload.user_id]});

            if(result.errors)
                throw {message: result.errors[0].error}
            else if(result.data && result.data.length > 1)
                throw {message: "Your admin account has already been activated!"};

            const new_hashed_pass = await hash(password, 10);

            const query = "INSERT INTO usercredential (user_id, hashed, username, is_admin_auth) values (?, ?, ?, 1) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});
            if(!data && errors){
                errors[0].error = handleErrorMessages(errors[0].error);
                res.status(500).json({errors})
            }else res.status(200).json({data, errors});

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]})
        }
    }
    else if(req.query.forgotPassword){
        try{
            const {password, confirm, token} = JSON.parse(req.body);
            console.log(password, confirm, token);
            if(password !== confirm)
                throw {message: "Passwords don't match!"};

            if(password.length < 8)
                throw {message: "Your password must be at least 8 characters long!"};

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
            const {data, errors} = await doqueryNew({query: check_old_pass_query, values: [payload.user_id]});

            if(errors || (data && !data.length))
                throw {message: "An error occured while resetting your password"};

            const compare_res = await compare(password, data[0].hashed);

            if(compare_res)
                throw {message: "Old password can't be the same as new password!"};

            const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 0 ";
            const {data:d, errors:err} = await doqueryNew({query: query, values: [new_hashed_pass, payload.user_id]});

            res.status(200).json({data:d, errors:err});

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]});
        }

    }else if(req.query.forgotAdminPassword){
        try{
            const {password, confirm, token} = JSON.parse(req.body);
            if(password !== confirm)
                throw {message: "Passwords don't match!"};
            if(password.length < 8)
                throw {message: "Your password must be at least 8 characters long!"};
            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);
            const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 1 " ;
            const {data, errors} = await doqueryNew({query: check_old_pass_query, values: [payload.user_id]});

            if(errors || (data && !data.length))
                throw {message: "An error occured while resetting your password"};

            const compare_res = await compare(password, data[0].hashed);

            if(compare_res)
                throw {message: "Old password can't be the same as new password!"};

            const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 1 ";
            const {data:d, errors:err} = await doqueryNew({query: query, values: [new_hashed_pass, payload.user_id]});
            res.status(200).json({data:d, errors:err});

        }catch(error){
            if(!error.message)
                error = handleErrorMessages(error);
            console.log(error);
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else res.redirect("/401", 401);
}

export default corsMiddleware(checkApiKey(handler));