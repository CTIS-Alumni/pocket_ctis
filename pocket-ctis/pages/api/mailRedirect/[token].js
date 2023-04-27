import {verify} from "../../../helpers/jwtHelper";

export default async function handler(req,res){
    const {token} = req.query;
    try{
        const {payload} = await verify(token, process.env.RESET_PASS_SECRET);
        if(payload.type === "forgotPassword")
            res.redirect('/resetPassword?token='+token, 200).json({token:token});
        else res.redirect('/login', 500).json({error: error.message});
    }catch(error){
        res.redirect('/login', 500).json({error: error.message});
    }
}
