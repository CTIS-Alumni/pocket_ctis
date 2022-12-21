import {NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";

const secret = process.env.SECRET;

export default async function middleware(req){
    const {cookies} = req;
    const refresh_token = cookies.get("RefreshJWT")?.value;
    const jwt = cookies.get("PocketCTISJWT")?.value;
    console.log(refresh_token);
    console.log(jwt);
    const url = req.url;

    if(jwt === undefined && !url.includes("login")){
        if(url.includes("user") || url.includes("logout"))
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
    }
    if(jwt){
        try{
            await verify(jwt, secret);
            console.log("verified");
            if(url.includes("login"))
                return NextResponse.redirect(process.env.ORIGIN_PATH + "/user");
        }catch(error){
            console.log("couldnt verify");
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
        }

    }
}
