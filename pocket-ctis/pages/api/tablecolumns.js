import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        if(payload.user === "admin"){
            const method = req.method;
            switch (method) {
                case "GET":
                    try {
                        const query = "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM information_schema.columns WHERE table_schema = DATABASE() ORDER BY table_name, ordinal_position";
                        const {data, errors} = await doqueryNew({query: query, values: []});
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                    break;
            }
        } res.status(403).json({errors: [{error: "Forbidden action!"}]});
    } else res.redirect("/401", 401);
}