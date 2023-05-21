import { NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";
import {refreshToken} from "./helpers/jwtHelper";
import {parse} from "cookie";

export default async function middleware(req){
    //WORKS WITH SERVER SIDE RENDERING
    //every getServerSideProps executed goes through here first
    let cookies = null;
    if(req.headers.get('cookie'))
        cookies = parse(req.headers.get('cookie'));

    const access = cookies?.AccessJWT || null;
    const refresh = cookies?.RefreshJWT || null;

    const url = req.url
    const response = NextResponse.next();

   if(!access && refresh){
        try{
            const {serialCookie, refreshCookie} = await refreshToken(refresh);
            response.headers.set("Set-Cookie", [serialCookie,refreshCookie]);
            return response;
        }catch(error){
            console.log("An error happened while refreshing access token")
        }
    }
   //deleted the !includes(login) from here
    if(!refresh && (url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") || url.includes("admin") || url.includes('logout'))){
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
    }

    if(access && refresh){
        try{
            const {payload} =  await verify(access, process.env.ACCESS_SECRET);

            if(url.includes("login") && !url.includes("admin") && payload.mode === "user"){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }
            else if(url.includes("login") && payload.mode === "admin"){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin");
            }
            else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") && payload.mode === "admin"){
                    return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin");
            }else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin") && payload.mode === "user"){
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }


        }catch(error){
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }

    }
}

