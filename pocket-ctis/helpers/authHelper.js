import {doquery, doqueryNew} from "./dbHelpers";
import {refreshToken, verify} from "./jwtHelper";
import {parse} from "cookie";

export const checkAuth = async (headers, res) => { //verify the token here and make the payload available globally in the api
    let token;
    try {
        if (headers.cookie) {
            const cookies = parse(headers.cookie)

            if (cookies.RefreshJWT && !cookies.AccessJWT) { //if access token doesn't exist refresh it first
                const {serialCookie, refreshCookie} = await refreshToken(cookies.RefreshJWT);
                res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                token = parse(serialCookie).AccessJWT;
            } else token = cookies.AccessJWT || null;

        }else return null;

        const session = await verify(token, process.env.ACCESS_SECRET);
        return session;
    } catch (error) {
        return null
    }
}

export const checkUserType = async (session, query) => {
    try {
        if (session.payload.mode === "admin") {
            const db_query = "SELECT GROUP_CONCAT(DISTINCT act.type_name) as 'user_types' FROM useraccounttype uct " +
                "LEFT OUTER JOIN accounttype act ON (act.id = uct.type_id) WHERE uct.user_id = ? ";
            const {data, errors} = await doqueryNew({query: db_query, values: [session.payload.user_id]});

            if (errors  && !data[0].user_types.split(",").includes("admin"))
                return null;

            return {user: "admin", user_id: session.payload.user_id}

        } else if (session.payload.user_id === parseInt(query.user_id))
            return {user: "owner", user_id: session.payload.user_id};
        else return {user: "visitor", user_id: session.payload.user_id};
    } catch (error) {
        return null;
    }
}
