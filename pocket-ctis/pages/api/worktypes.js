import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, work_type_name FROM worktype order by work_type_name asc";
                    const {data, errors} = await doqueryNew({query: query});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }

    }else {
        res.redirect("/401", 401);
    }
}