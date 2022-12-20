import {verify} from "jsonwebtoken";
import {NextResponse} from "next/server";

const secret = process.env.SECRET;

export default async function middleware(req){
    const {cookies} = req;
    const jwt = cookies.PocketCTISJWT;
    const url = req.url;
    if(!url.includes("login")){
        if(jwt === undefined)
            return NextResponse.redirect("/login");
        try{
            verify(jwt, secret);
            return NextResponse.next();
        }catch(error){
            return NextResponse.redirect("/login");
        }
    }
    return NextResponse.next();
}