import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session && payload) {
        try {
            const data_query = "SELECT u.id, u.first_name, u.last_name, u.is_active, upp.profile_picture, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types' " +
                "FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                "JOIN accounttype act ON (act.id = uat.type_id) " +
                "LEFT OUTER JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                "WHERE u.id = ? GROUP BY u.id "

            const data = await doquery({query: data_query, values: [payload.user_id]});
            res.status(200).json({data});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.redirect("/401", 401);
    }
}