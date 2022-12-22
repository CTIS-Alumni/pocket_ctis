import {sign} from "../../helpers/jwtHelper";
import {serialize} from "cookie";
import {doquery} from "../../helpers/dbconnect";


export default async function(req,res){
    const {username, password} = JSON.parse(req.body);
    try{
        const query = "SELECT * FROM usercredential WHERE username = ? ";
        const user = await doquery({query: query,values: [username]});
        if(user.hasOwnProperty("error"))
            res.status(500).json({error: user.error.message});
        else {
            try{
                if(user.length > 0 && user[0].hashed === password){
                    const access_token = await sign({
                        user_id: user[0].user_id
                    }, process.env.ACCESS_SECRET, 60*7);

                    const refresh_token = await sign({
                        user_id: user[0].user_id
                    }, process.env.REFRESH_SECRET, 60*60*24*3);

                    const serialCookie = serialize("PocketCTISJWT", access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "strict",
                        maxAge: 60*7,
                        path: "/"
                    });

                    const refreshCookie = serialize("RefreshJWT", refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "strict",
                        maxAge: 60*60*24*3,
                        path: "/"
                    });

                    res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                    res.status(200).json({message: "Authenticated Successfully"});
                }else{
                    res.status(401).json({message: "Invalid credentials"});
                }
            }catch(error){
                res.status(500).json({error: user.error.message});
            }
        }
        }catch(error) {
        res.status(500).json({error: error.message})
    }
}
