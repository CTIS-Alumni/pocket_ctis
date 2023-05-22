import {sign} from "../../helpers/jwtHelper";
import {serialize} from "cookie";
import {doqueryNew} from "../../helpers/dbHelpers";
import {compare} from "bcrypt"
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {corsMiddleware} from "./middleware/cors";
import {checkApiKey} from "./middleware/checkAPIkey";


const handler =  async (req, res) => {
    if (req.query.admin) {
        const session = await checkAuth(req.headers, res);
        const payload = await checkUserType(session, req.query);

        try {
            if (session.payload.mode !== "user") {
                throw { message: "Forbidden request!"}
            }

            const {username, password} = JSON.parse(req.body);
            const admin_query = "SELECT uat.user_id, act.type_name FROM useraccounttype uat LEFT OUTER JOIN accounttype act " +
                "ON (uat.type_id = act.id) WHERE uat.user_id = ? and act.type_name = 'admin' ";
            const {data: d, errors: err} = await doqueryNew({query: admin_query, values: [payload.user_id]});

            if (err || (d && !d.length)) {
                throw { message: "Unauhtorized!"}
            }

            const query = "SELECT hashed FROM usercredential WHERE username = ? AND is_admin_auth = 1 AND  user_id = ? ";
            const {data, errors} = await doqueryNew({query: query, values: [username, payload.user_id]});
            const user = data;

            if (errors || (data && !data.length))
                throw { message: "Wrong username or password!"};


            const result = await compare(password, user[0].hashed)
            if (!result)
                throw { message: "Wrong username or password!"};

            const access_token = await sign({
                user_id: payload.user_id,
                mode: "admin"
            }, process.env.ACCESS_SECRET, 60 * 10);

            const refresh_token = await sign({
                user_id: payload.user_id,
                mode: "admin"
            }, process.env.REFRESH_SECRET, 60 * 60 * 24 * 3);

            const serialCookie = serialize("AccessJWT", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 60 * 10,
                path: "/"
            });

            const refreshCookie = serialize("RefreshJWT", refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 5,
                path: "/"
            });

            res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
            res.status(200).json({data: [{message: "Switched to admin mode successfully!"}], errors: errors});

        } catch (error) {
            res.status(500).json({errors: [{error: error.message}]});

        }
    } else {
        try {
            const {username, password} = JSON.parse(req.body);

            const query = "SELECT u.id, u.first_name, u.last_name, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', u.contact_email, u.gender, uc.hashed " +
            " FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) " +
            " LEFT OUTER JOIN useraccounttype uat ON (u.id = uat.user_id) " +
            " LEFT OUTER JOIN accounttype act ON (act.id = uat.type_id) " +
            " WHERE username = ? AND is_admin_auth = 0 AND u.is_active = 1 "

            const {data, errors} = await doqueryNew({query: query, values: [username]});
            const user = data;

            if (errors || (data && !data.length)) {
                throw { message: "Wrong username or password!"};
            }

            compare(password, user[0].hashed, async function (err, result) {
                if (err)
                    res.status(500).json({errors: [{error: err.message}]});
                if (!result)
                    res.status(401).json({errors: [{error: "Wrong username or password!"}]});

                const access_token = await sign({
                    user_id: user[0].id,
                    mode: "user"
                }, process.env.ACCESS_SECRET, 60 * 10);

                const refresh_token = await sign({
                    user_id: user[0].id,
                    mode: "user"
                }, process.env.REFRESH_SECRET, 60 * 60 * 24 * 3);

                const serialCookie = serialize("AccessJWT", access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 60 * 10,
                    path: "/"
                });

                const refreshCookie = serialize("RefreshJWT", refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 5,
                    path: "/"
                });

                delete user[0].hashed;
                res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                res.status(200).json({data: user, errors: errors});
            });
        } catch (error) {
            res.status(500).json({errors: [{error: error.message}]});
        }
    }

}

export default corsMiddleware(checkApiKey(handler));
