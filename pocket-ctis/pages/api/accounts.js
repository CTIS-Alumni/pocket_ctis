import {verify} from "../../helpers/jwtHelper";
import {compare, hash} from "bcrypt";
import {doquery, doqueryNew} from "../../helpers/dbHelpers";

export default async function handler(req, res) {
    if(req.query.activate){
        try{
            const {username, password, token} = JSON.parse(req.body);

            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const query = "INSERT INTO usercredential (user_id, hashed, username) values (?, ?, ?) ";
            const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, new_hashed_pass, username]});

            if(data){
                const activate_query = "UPDATE users SET is_active = 1 WHERE id = ? ";
                const {data, errors} = await doqueryNew({query: activate_query, values: [payload.user_id]});
                res.status(200).json({data,errors})
            }
            else {
                if(errors[0].error.includes("Duplicate")){
                    errors[0].error = "Username is taken!";
                }
                res.status(200).json({errors})
            }

        }catch(error){
            res.status(500).json({errors: [{error: error.message}]})
        }
    }else if(req.query.forgotPassword){
        try{
            const {password, token} = JSON.parse(req.body);
            const {payload} = await verify(token, process.env.MAIL_SECRET);
            const new_hashed_pass = await hash(password, 10);

            const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? ";
            const {data, errors} = await doqueryNew({query: check_old_pass_query, values: [payload.user_id]});

            if(data[0].hashed){
                const compare_res = await compare(password, data[0].hashed);

                if(compare_res)
                    res.status(500).json({errors: [{error: "Old password can not be the same as new password!"}]});
                else {
                    const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? ";
                    const {data, errors} = await doqueryNew({query: query, values: [new_hashed_pass, payload.user_id]});

                    res.status(200).json({data, errors});
                }
            } else res.status(500).json({errors: [{error: "An error occured while resetting your password."}]});
        }catch(error){
            res.status(500).json({errors: [{error: error.message}]});
        }
    }
    else res.redirect("/401", 401);

}