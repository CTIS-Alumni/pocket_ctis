import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {doqueryNew} from "../../helpers/dbHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query)
    if (session && payload) {
        const method = req.method;
        switch (method){
            case "GET":
                try {
                    const query = "SELECT u.id, u.first_name, u.last_name, u.is_active, u.contact_email, upp.profile_picture, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types' " +
                        "FROM users u LEFT OUTER JOIN usercredential uc ON (u.id = uc.user_id) JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "LEFT OUTER JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                        "WHERE u.id = ? GROUP BY u.id "

                    const {data,errors} = await doqueryNew({query: query, values: [payload.user_id]});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                try{

                }catch(error){
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);