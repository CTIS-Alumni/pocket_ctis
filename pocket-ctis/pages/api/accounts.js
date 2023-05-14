import {verify} from "../../helpers/jwtHelper";
import {compare, hash} from "bcrypt";
import {doqueryNew} from "../../helpers/dbHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";

const handleErrorMessages = (error) => {
    if(error.includes("timestamp check"))
        return {code: 401, message: "Expired link!"};
    if(error.includes("Duplicate"))
        return {code: 500, message: "Username is taken!"}
    return error;
}

export default async function handler(req, res) {
    if(req.query.activateAccount){
        try{
            const {username, password, token} = JSON.parse(req.body);

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const check_credentials_query = "SELECT username FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
            const result = await doqueryNew({query: check_credentials_query, values: [payload.user_id]});

            if(result.errors)
                throw {message: result.errors[0].error}
            else if(result.data && result.data.length > 1)
                throw {code: 500, message: "Your admin account has already been activated!"};

            const query = "INSERT INTO usercredential (user_id, hashed, username, is_admin_auth) values (?, ?, ?, 0) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});

            if(data){
                const activate_query = "UPDATE users SET is_active = 1 WHERE id = ? ";
                const {data: d, errors: err} = await doqueryNew({query: activate_query, values: [payload.user_id]});
                res.status(200).json({data: d,errors: err})
            }
            else {
                errors[0].error = handleErrorMessages(errors[0].error);
                let code = 500;
                if(errors[0].error.code)
                    code = errors[0].error.code
                res.status(code).json({errors})
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
                throw {code: 500, message: "Your admin account has already been activated!"};

            const new_hashed_pass = await hash(password, 10);

            const query = "INSERT INTO usercredential (user_id, hashed, username, is_admin_auth) values (?, ?, ?, 1) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});
            if(!data && errors){
                errors[0].error = handleErrorMessages(errors[0].error);
                let code = 500;
                if(errors[0].error.code)
                    code = errors[0].error.code
                res.status(code).json({errors})
            }else res.status(200).json({data, errors});

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]})
        }
    }
    else if(req.query.forgotPassword){
        try{
            const {password, confirm, token} = JSON.parse(req.body);
            if(password !== confirm)
                throw {code: 400, message: "Passwords don't match!"};

            if(password.length < 6)
                throw {code: 400, message: "Your password must be at least 6 characters long!"};

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 0 ";
            const {data, errors} = await doqueryNew({query: check_old_pass_query, values: [payload.user_id]});

            if(errors || (data && !data.length))
                throw {code: 500, message: "An error occured while resetting your password"};

            const compare_res = await compare(password, data[0].hashed);

            if(compare_res)
                throw {code: 400, message: "Old password can't be the same as new password!"};

            const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 0 ";
            const {data:d, errors:err} = await doqueryNew({query: query, values: [new_hashed_pass, payload.user_id]});

            res.status(200).json({data:d, errors:err});

        }catch(error){
            let code = 500;
            if(error.code)
                code = error.code;
            res.status(code).json({errors: [{error: error.message}]});
        }

    }else if(req.query.forgotAdminPassword){
        try{
            const {password, confirm, token} = JSON.parse(req.body);
            if(password !== confirm)
                throw {code: 400, message: "Passwords don't match!"};
            if(password.length < 6)
                throw {code: 400, message: "Your password must be at least 6 characters long!"};
            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);
            const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? AND is_admin_auth = 1 " ;
            const {data, errors} = await doqueryNew({query: check_old_pass_query, values: [payload.user_id]});

            if(errors || (data && !data.length))
                throw {code: 500, message: "An error occured while resetting your password"};

            const compare_res = await compare(password, data[0].hashed);

            if(compare_res)
                throw {code: 400, message: "Old password can't be the same as new password!"};

            const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? AND is_admin_auth = 1 ";
            const {data:d, errors:err} = await doqueryNew({query: query, values: [new_hashed_pass, payload.user_id]});
            res.status(200).json({data:d, errors:err});

        }catch(error){
            error = handleErrorMessages(error);
            let code = 500;
            if(error.code)
                code = error.code
            res.status(code).json({errors: [{error: error.message}]});
        }
    }
    else res.redirect("/401", 401);
}