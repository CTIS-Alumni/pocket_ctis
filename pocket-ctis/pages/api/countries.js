import {doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {corsMiddleware} from "./middleware/cors";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT * FROM country order by country_name asc";
                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    }else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));