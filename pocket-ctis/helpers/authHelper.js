import {doquery} from "./dbHelpers";
import {refreshToken, verify} from "./jwtHelper";
import {parse} from "cookie";

export const checkAuth = async (headers, res) => { //verify the token here and make the payload available globally in the api
    let token;
    if(headers.cookie){
        const cookies = parse(headers.cookie)
        if(cookies.RefreshJWT && !cookies.AccessJWT){ //if access token doesn't exist refresh it first
            const {serialCookie, refreshCookie} = await refreshToken(cookies.RefreshJWT, process.env.REFRESH_SECRET);
            res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
            token = parse(serialCookie).AccessJWT;
        }else token = cookies.AccessJWT;
    }else
        token = headers['authorization']?.split(" ")[1];
    if(!token)
        return null;
    try {
        const session =  await verify(token, process.env.ACCESS_SECRET);
        return  session;
    }catch(error){
        return null
    }
}

export const checkUserType = async (session, query) => {
    if(session.payload.mode === "admin"){
        let data;
        try{
            const db_query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types' FROM useraccounttype uct " +
                "LEFT OUTER JOIN accounttype act ON (act.id = uct.type_id) WHERE uct.user_id = ? ";
             data = await doquery({query: db_query, values: [query.user_id]});
        }catch(error){
            return null;
        }
        if (data.length !== 1 || !data[0].user_types.split(",").includes("admin"))
            return null;

        return {user: "admin"}

    }else if(session.payload.user_id === parseInt(query.user_id))
        return {user: "owner", user_id: session.payload.user_id};
    else return {user: "visitor", user_id: session.payload.user_id};
}

/*export const checkAuth = async (headers, query, check_user_type = false) => {
    let token = headers['authorization']?.split(" ")[1] || parse(headers.cookie).AccessJWT;
    if(!token)
        return {error: "No Bearer Token"}
    try{
        const session = await verify (token, process.env.ACCESS_SECRET);
        if(session.user_id && !check_user_type)
            return {user: "any"}
        if(session.payload.user_id === parseInt(query.user_id))
            return {user: "owner", user_id: session.payload.user_id};
        else if(session.payload.mode === "admin"){
            const db_query = "SELECT GROUP_CONCAT(act.type_name) as 'user_types' FROM useraccounttype uct " +
                "LEFT OUTER JOIN accounttype act ON (act.id = uct.type_id) WHERE uct.user_id = ? ";
            const data = await doquery({query: db_query, values: [query.user_id]});

            if (data.length !== 1 || !data[0].user_types.split(",").includes("admin"))
                return {error: "length isnt one or user type isnt admin"}

            return {user: "admin"}

        }else return {user: "visitor", user_id: session.payload.user_id};
    }catch(error){
        return {error: "some general error"};
    }
}*/