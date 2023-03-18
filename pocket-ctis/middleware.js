import {NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";
import {refreshToken} from "./helpers/jwtHelper";

export default async function middleware(req){
    const {cookies} = req;
    const all_cookies = cookies.getAll();
    let jwt;
    let refresh;
    all_cookies.forEach((cookie)=>{
        if(cookie.name === "AccessJWT"){
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
        if(!url.includes("users") && url.includes("user") || url.includes("logout")) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }
    }
    if(jwt && refresh){
        try{
            await verify(jwt, process.env.ACCESS_SECRET);
            if(url.includes("login")){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }
        }catch(error){
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }

    }
}

export function setCORS(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
}