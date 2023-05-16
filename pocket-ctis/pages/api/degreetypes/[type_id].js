import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../helpers/authHelper";
import {checkApiKey} from "../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (payload?.user === "admin") {
        const method = req.method;
        const {type_id} = req.query;
        switch (method) {
            case "PUT":
                try {
                    const {degree_name} = req.body.degreetype;
                    const query = "UPDATE degreetype SET degree_type_name = ? WHERE id = ?"
                    const {data, errors} = await doqueryNew({query: query, values: [degree_name, type_id]});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const query = "DELETE FROM degreetypes WHERE id = ?"
                    const data = await doquery({query: query, values: [degree_id]});
                    res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);