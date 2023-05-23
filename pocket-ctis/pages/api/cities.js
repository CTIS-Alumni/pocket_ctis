import {doqueryNew} from "../../helpers/dbHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import {corsMiddleware} from "./middleware/cors";

const handler =  async (req, res) => {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT c.id, c.city_name, c.country_id, co.country_name FROM city c LEFT OUTER JOIN country co ON (co.id = c.country_id) order by c.city_name asc"; //for dropboxes
                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
}
export default corsMiddleware(checkApiKey(handler));