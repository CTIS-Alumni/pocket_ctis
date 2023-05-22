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

    console.log("-1")

    const access = cookies?.AccessJWT || null;
    const refresh = cookies?.RefreshJWT || null;

    console.log("-2")

    const url = req.url
    const response = NextResponse.next();

    console.log("-3")

   if(!access && refresh){
        try{
            const {serialCookie, refreshCookie} = await refreshToken(refresh);
            response.headers.set("Set-Cookie", [serialCookie,refreshCookie]);
            console.log("-4")
            return response;
        }catch(error){
            console.log("-5")
            console.log("An error happened while refreshing access token")
        }
    }
   //deleted the !includes(login) from here
    console.log("-6")
    if(!refresh && (url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") || url.includes("admin") || url.includes('logout'))){
        console.log("1")
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
    }

    console.log("-7")
    if(access && refresh){
        try{
            console.log("-8")
            const {payload} =  await verify(access, process.env.ACCESS_SECRET);


            console.log("-9")

            if(url.includes("login") && !url.includes("admin") && payload.mode === "user"){
                console.log("2")
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }
            else if(url.includes("login") && payload.mode === "admin"){
                console.log("3")
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin");
            }
            else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user") && payload.mode === "admin"){
                console.log("4")
                    return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin");
            }else if(url.includes(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/admin") && payload.mode === "user"){
                console.log("5")
                return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/user");
            }

            console.log("7");
        }catch(error){
            console.log("6")
            console.log(error);
            return NextResponse.redirect(process.env.NEXT_PUBLIC_ORIGIN_PATH + "/login");
        }

    }
}

