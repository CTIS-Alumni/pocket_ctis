import { NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";
import {refreshToken} from "./helpers/jwtHelper";

export async function apiMiddleware(req, res){
    const {cookies} = req;
    const all_cookies = cookies.getAll();
    console.log(all_cookies);
    let jwt;
    let refresh;
    all_cookies.forEach((cookie)=>{
        if(cookie.name === "AccessJWT"){
            jwt = cookie.value
        }

        else if(cookie.name === "RefreshJWT"){
            refresh = cookie.value
        }
    });

    if(jwt === undefined && refresh){
        try{
            const {serialCookie, refreshCookie} = await refreshToken(refresh, process.env.REFRESH_SECRET);
            const requestHeaders = new Headers(req.headers)
            requestHeaders.set("cookie", [serialCookie, refreshCookie]);
            NextResponse.next();
        }catch(error){
            console.log("An error happened while refreshing access token")
        }
    }
}

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
            const {serialCookie, refreshCookie} = await refreshToken(refresh, process.env.REFRESH_SECRET);
            const response = NextResponse.next();
            response.headers.set("Set-Cookie", [serialCookie,refreshCookie]);
            return response;
        }catch(error){
            console.log("An error happened while refreshing access token")
        }
    }
    if(refresh === undefined && !url.includes("login")){
        if(!url.includes("users") && url.includes("user") || url.includes("logout")) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }
    }
    if(access && refresh){
        try{
            await verify(access, process.env.ACCESS_SECRET);
            if(url.includes("login")){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }
        }catch(error){
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }

    }
}
