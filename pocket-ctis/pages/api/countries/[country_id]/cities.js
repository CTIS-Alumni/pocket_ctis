import {doquery, doqueryNew} from "../../../../helpers/dbHelpers";
import {checkAuth} from "../../../../helpers/authHelper";
import {checkApiKey} from "../../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const {country_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "select id, city_name from city where country_id = ? order by city_name asc";

                    const {data, errors} = await doqueryNew({query: query, values: [country_id]});
                        res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);