import {serialize} from "cookie";

export default async function(req,res){
    const {cookies} = req;
    let remove_cookies = [];

    if(cookies.AccessJWT) {
        const serialCookie = serialize("AccessJWT", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/"
        });
        remove_cookies.push(serialCookie);
    }
    if(cookies.RefreshJWT) {
        const refreshCookie = serialize("RefreshJWT", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/"
        });
        remove_cookies.push(refreshCookie);
    }
        res.setHeader("Set-Cookie", remove_cookies);
        res.status(200).json({message: "Logged out"})
}
