import {doquery} from "../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../helpers/authHelper";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                        "u.is_retired, u.is_active, u.bilkent_id, u.contact_email FROM users u " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "WHERE u.id = ? GROUP BY u.id";

                    const data = await doquery({query: query, values: [user_id]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const {first_name, last_name, is_retired, is_active, nee, gender, contact_email, bilkent_id} = req.body.user;
                    const query = "UPDATE users SET is_retired = ?, is_active = ?, nee = ?  WHERE id = ?";
                    const data = await doquery({
                        query: query,
                        values: [is_retired, is_active, graduation_project_id, nee, user_id]
                    });
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                if (payload?.user === "admin") {
                    try {
                        const query = "DELETE FROM users WHERE id = ?"
                        const data = await doquery({query: query, values: [user_id]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}