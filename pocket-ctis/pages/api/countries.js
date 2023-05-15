import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT * FROM country order by country_name asc"; //for dropboxes
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