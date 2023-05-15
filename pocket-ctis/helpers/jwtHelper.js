import {SignJWT, jwtVerify} from 'jose';
import {serialize} from "cookie";

export const sign = async (payload, secret, age) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + age;
    return new SignJWT({payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}


export const verify = async (token, secret) => {
    const {payload} = await jwtVerify(token,new TextEncoder().encode(secret));
    return payload;

}

export const deleteCookie = (name) => {
    const expired_cookie = serialize(name, null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/"
    });

    return expired_cookie;
}

export const refreshToken = async (refresh_token) => {
    try{
        const {payload} = await verify(refresh_token, process.env.REFRESH_SECRET);
        const access_token = await sign({user_id: payload.user_id, mode: payload.mode}, process.env.ACCESS_SECRET, 60*10);

        const serialCookie = serialize("AccessJWT", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60*10,
            path: "/"
        });

        //make a new refresh token
        const new_refresh_token = await sign({user_id: payload.user_id, mode: payload.mode}, process.env.REFRESH_SECRET, 60*60*24*3);

        const refreshCookie = serialize("RefreshJWT", new_refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60*60*24*3,
            path: "/"
        });

        return {serialCookie, refreshCookie};
    }catch(error){
       console.log("there was an error somwehwere in the refresh fubction");
    }
}