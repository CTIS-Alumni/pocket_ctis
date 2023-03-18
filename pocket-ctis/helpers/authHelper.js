import {doquery} from "./dbHelpers";
import {verify} from "./jwtHelper";
import {parse} from "cookie";

export const checkAuth = async (headers, query) => {
    let token = headers['authorization']?.split(" ")[1] || parse(headers.cookie).AccessJWT;
    if(!token)
        return {error: "No Bearer Token"}
    try{
        const session = await verify (token, process.env.ACCESS_SECRET);
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
}