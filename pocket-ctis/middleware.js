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
    if(refresh === undefined && !url.includes("login")){
        if(url.includes("user") || url.includes("logout")) {
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
        }
    }
    if(jwt){
        try{
            await verify(jwt, process.env.ACCESS_SECRET);
            if(url.includes("login")){
                return NextResponse.redirect(process.env.ORIGIN_PATH + "/user");
            }
        }catch(error){
            return NextResponse.redirect(process.env.ORIGIN_PATH + "/login");
        }

    }
}
