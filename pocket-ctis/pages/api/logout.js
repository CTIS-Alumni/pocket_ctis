import {serialize} from "cookie";

export default async function(req,res){
    const {cookies} = req;
    const jwt = cookies.PocketCTISJWT;

    if(jwt){
        const serialCookie = serialize("PocketCTISJWT", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/"
        });

        const refreshCookie = serialize("RefreshJWT", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/"
        });

        res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
        res.status(200).json({message: "Logged out"})
    }
}
