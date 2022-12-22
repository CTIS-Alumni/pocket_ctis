import {SignJWT, jwtVerify} from 'jose';
import {serialize} from "cookie";

export async function sign(payload, secret, age){
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + age;
    return new SignJWT({payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function verify(token, secret) {
    const {payload} = await jwtVerify(token,new TextEncoder().encode(secret));
    return payload;
}

export async function refreshToken(refresh_token, secret){
    try{
        const {payload} = await verify(refresh_token, secret);
        const access_token = await sign({user_id: payload.user_id}, process.env.ACCESS_SECRET, 20);

        const serialCookie = serialize("PocketCTISJWT", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 20,
            path: "/"
        });

        //make a new refresh token
        const new_refresh_token = await sign({user_id: payload.user_id}, process.env.REFRESH_SECRET, 60*60*24*3);

        const refreshCookie = serialize("RefreshJWT", new_refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60*6*24*3,
            path: "/"
        });

        return {serialCookie, refreshCookie};
    }catch(error){
       console.log("there was an error somwehwere in the refresh fubction");
    }
}