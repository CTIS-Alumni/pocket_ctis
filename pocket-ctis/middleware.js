import { NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";
import {refreshToken} from "./helpers/jwtHelper";

export default async function middleware(req){
    const {cookies} = req;
    const all_cookies = cookies.getAll();
    let access;
    let refresh;
    all_cookies.forEach((cookie)=>{
        if(cookie.name === "AccessJWT"){
            access = cookie.value;
        }

        else if(cookie.name === "RefreshJWT"){
            refresh = cookie.value;
        }
    });
    const url = req.url

   if(access === undefined && refresh){
        try{
            const {serialCookie, refreshCookie} = await refreshToken(refresh);
            const response = NextResponse.next();
            response.headers.set("Set-Cookie", [serialCookie,refreshCookie]);
            return response;
        }catch(error){
            console.log("An error happened while refreshing access token")
        }
    }
    if(refresh === undefined && !url.includes("login")){
        if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") ||
            url.includes("logout") || url.includes("admin")) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }
    }
    if(access && refresh){
        try{
            const {payload} =  await verify(access, process.env.ACCESS_SECRET);

            if(url.includes("login")){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") && payload.mode === "admin"){
                    return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin");
            }else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin") && payload.mode === "user")
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");


        }catch(error){
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }

    }
}
