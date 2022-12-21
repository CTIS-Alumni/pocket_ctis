import {SignJWT, jwtVerify} from 'jose';

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