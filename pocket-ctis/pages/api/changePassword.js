import {verify} from "../../helpers/jwtHelper";
import {compare, hash} from "bcrypt";
import {doMultiQueries, doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res) {
    const {password, token} = JSON.parse(req.body);
    try{
        const {payload} = await verify(token, process.env.RESET_PASS_SECRET);
        const new_hashed_pass = await hash(password, 10);
        const check_old_pass_query = "SELECT hashed FROM usercredential WHERE user_id = ? ";
        const data = await doquery({query: check_old_pass_query, values: [payload.user_id]});
        if(data[0].hashed){
            const compare_res = await compare(password, data[0].hashed);
           if(compare_res)
               res.status(500).json({error: "Old password can not be the same as new password!"});
           else {
               const query = "UPDATE usercredential SET hashed = ? WHERE user_id = ? ";
               const data = await doquery({query: query, values: [new_hashed_pass, payload.user_id]});
               res.status(200).json({data});
           }
        }
        res.status(500).json({error: "An error occured while resetting your password."});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}