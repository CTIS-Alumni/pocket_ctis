import {sign} from "../../helpers/jwtHelper";
import {serialize} from "cookie";
import {doquery} from "../../helpers/dbHelpers";
import {compare} from "bcrypt"


export default async function (req, res) {
    const {username, password} = JSON.parse(req.body);
    try {
            const query = "SELECT * FROM usercredential WHERE username = ? ";
            const user = await doquery({query: query, values: [username]});
            if (user.hasOwnProperty("error"))
                res.status(500).json({error: user.error.message});
            else {
                try {
                    if (user.length) {
                        compare(password, user[0].hashed, async function (err, result){
                            if(err)
                                res.status(500).json({error: err.message});
                            if(!result)
                                res.status(401).json({error: "Invalid credentials!"});

                            const access_token = await sign({
                                user_id: user[0].user_id,
                                mode: "user"
                            }, process.env.ACCESS_SECRET, 60 * 10);

                            const refresh_token = await sign({
                                user_id: user[0].user_id,
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
                                maxAge: 60 * 60 * 24 * 3,
                                path: "/"
                            });

                            const data_query = "SELECT u.id, u.first_name, u.last_name, upp.profile_picture, GROUP_CONCAT(act.type_name) as 'user_types' " +
                                "FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                                "JOIN accounttype act ON (act.id = uat.type_id) " +
                                "LEFT OUTER JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                                "WHERE uc.username = ? "

                            const data = await doquery({query: data_query,values: [username]});

                            if(data.hasOwnProperty("error"))
                                res.status(500).json({error: data.error.message})

                            res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                            res.status(200).json({data});
                        });
                    } else {
                        res.status(401).json({error: "Invalid credentials"});
                    }
                } catch (error) {
                    res.status(500).json({error: user.error.message});
                }
            }

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
