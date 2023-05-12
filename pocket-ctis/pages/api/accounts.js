import {verify} from "../../helpers/jwtHelper";
import {compare, hash} from "bcrypt";
import {doquery, doqueryNew} from "../../helpers/dbHelpers";

const handleErrorMessages = (error) => {
    if(error.message.includes("timestamp check"))
        return "Expired token!";
    if(error.message.includes("Duplicate"))
        return "Username is taken!"
    return error.message;
}

export default async function handler(req, res) {
    if(req.query.activate){
        try{
            const {username, password, token} = JSON.parse(req.body);

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const query = "INSERT INTO usercredential (user_id, hashed, username, is_admin_auth) values (?, ?, ?, 0) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});

            if(data){
                const activate_query = "UPDATE users SET is_active = 1 WHERE id = ? ";
                const {data: d, errors: err} = await doqueryNew({query: activate_query, values: [payload.user_id]});
                res.status(200).json({data: d,errors: err})
            }
            else {
                errors[0].error.message = handleErrorMessages(errors[0].error);
                res.status(200).json({errors})
            }

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]})
        }
    }else if(req.query.forgotPassword){
        try{
            const {password, confirm, token} = JSON.parse(req.body);
            if(password !== confirm)
                throw {message: "Passwords don't match!"};

            if(password.length < 6)
                throw {message: "Your password must be at least 6 characters long!"};

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

            if(password.length < 6)
                throw {message: "Your password must be at least 6 characters long!"};

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
            error.message = handleErrorMessages(error);
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else res.redirect("/401", 401);

}