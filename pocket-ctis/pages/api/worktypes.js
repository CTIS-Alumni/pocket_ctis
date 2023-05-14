import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res); //everyone logged in can get
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, work_type_name FROM worktype order by work_type_name asc";
                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    }else {
        res.redirect("/401", 401);
    }
}

export default checkApiKey(handler);