import {NextResponse} from "next/server";
import {verify} from "./helpers/jwtHelper";

const secret = process.env.SECRET;

export default async function middleware(req){
    const {cookies} = req;
    console.log(cookies);
    const jwt = cookies.PocketCTISJWT;
    const url = req.url;
    if(url.includes("/user")){
        if(jwt === undefined)
            return NextResponse.redirect(process.env.ORIGIN_PATH+"/login");
        try{
            await verify(jwt, secret);
            return NextResponse.next();
        }catch(error){
            return NextResponse.redirect(process.env.ORIGIN_PATH+"/login");
        }
    }else if(url.includes("login")){//if he is logged in he can't go back to login page
        if(jwt){
        try{
           await verify(jwt, secret);
           return NextResponse.redirect(process.env.ORIGIN_PATH+"/user");
        }catch(error){
            return NextResponse.next();
        }
        }
    }
    return NextResponse.next();
}