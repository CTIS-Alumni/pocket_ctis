import {sign} from "../../helpers/jwtHelper";
import {serialize} from "cookie";
import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {compare} from "bcrypt"


export default async function (req, res) {
    const {username, password} = JSON.parse(req.body);
    try {
            const query = "SELECT * FROM usercredential WHERE username = ? ";
            const {data, errors} = await doqueryNew({query: query, values: [username]});
            const user = data;
                try {
                    if (data.length) {
                        compare(password, data[0].hashed, async function (err, result){
                            if(err)
                                res.status(500).json({errors: [{error: err.message}]});
                            if(!result)
                                res.status(401).json({errors: [{error: "Invalid credentials!"}]});

                                const access_token = await sign({
                                    user_id: user[0].user_id,
                                    mode: "admin"
                                }, process.env.ACCESS_SECRET, 60 * 10);

                                const refresh_token = await sign({
                                    user_id: user[0].user_id,
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
                                    maxAge: 60 * 60 * 24 * 3,
                                    path: "/"
                                });

                            const data_query = "SELECT u.id, u.first_name, u.last_name, u.is_active, upp.profile_picture, GROUP_CONCAT(act.type_name) as 'user_types' " +
                                "FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                                "JOIN accounttype act ON (act.id = uat.type_id) " +
                                "LEFT OUTER JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                                "WHERE uc.username = ? "

                            const {data, errors} = await doqueryNew({query: data_query,values: [username]});

                            res.setHeader("Set-Cookie", [serialCookie, refreshCookie]);
                            res.status(200).json({data, errors});
                        });
                    } else {
                        res.status(401).json({errors: [{error: "Invalid credentials"}]});
                    }
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
