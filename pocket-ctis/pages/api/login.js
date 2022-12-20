import {sign} from "jsonwebtoken";
import {serialize} from "cookie";
import {doquery} from "../../helpers/dbconnect";

const secret = process.env.SECRET;

export default async function(req,res){
    const {username, password} = req.body;
    try{
        const query = "SELECT * FROM usercredential WHERE username = ? ";
        const user = await doquery({query: query,values: [username]});
        if(user.hasOwnProperty("error"))
            res.status(500).json({error: user.error.message});
        else {
             if(user.length > 0 && user[0].hashed === password){
                 const token = sign({
                     exp: Math.floor(Date.now() / 1000) + 60,
                     user_id: user[0].user_id
                 }, secret);

                 const serialCookie = serialize("PocketCTISJWT", token, {
                     httpOnly: true,
                     secure: process.env.NODE_ENV !== "development",
                     sameSite: "strict",
                     maxAge: 60,
                     path: "/"
                 });

                 res.setHeader("Set-Cookie", serialCookie);
                 res.status(200).json({serialCookie});
            res.status(200).json({user});
             }else{
                 res.status(401).json({message: "Invalid credentials"});
             }
        }
        }catch(error) {
        res.status(500).json({error: error.message})
    }
}
