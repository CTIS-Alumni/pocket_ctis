import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT * FROM studentsociety order by society_name asc";

                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin"){
                    try {
                        const {society_name, description} = req.body.society;
                        const query = "INSERT INTO studentsociety(society_name, description) values(?, ?)";
                        const data = await doquery({query: query, values: [society_name, description]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    } else {
        res.redirect("/401", 401);
    }

}
export default checkApiKey(handler);