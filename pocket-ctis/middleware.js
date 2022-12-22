import {NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";
import {refreshToken} from "./helpers/jwtHelper";

export default async function middleware(req){
    const {cookies} = req;
    const all_cookies = cookies.getAll();
    let jwt;
    let refresh;
    all_cookies.forEach((cookie)=>{
        if(cookie.name === "PocketCTISJWT"){
            jwt = cookie.value.split(";")[0];
        }

        else if(cookie.name === "RefreshJWT"){
            refresh = cookie.value.split(";")[0];
        }
    });
    const url = req.url
   if(jwt === undefined && refresh){
        try{
            const {serialCookie, refreshCookie} = await refreshToken(refresh, process.env.REFRESH_SECRET);
            const response = NextResponse.next();
            response.headers.set("Set-Cookie", [serialCookie,refreshCookie]);
            return response;
        }catch(error){
            console.log("An error happened while refreshing access token")
        }
    }


    if(jwt === undefined && refresh === undefined && !url.includes("login")){
        console.log("inside no jwt no refresh and url not login")
        if(url.includes("user") || url.includes("logout")){
            console.log("inside includes user or includes logout");
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
        }
    }
    if(jwt){
        try{
            console.log("there is jwt")
            await verify(jwt, process.env.ACCESS_SECRET);
            if(url.includes("login")){
                console.log("url includes login")
                return NextResponse.redirect(process.env.ORIGIN_PATH + "/user");
            }
        }catch(error){
            //console.log("couldnt verify");
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
        }

    }
}
