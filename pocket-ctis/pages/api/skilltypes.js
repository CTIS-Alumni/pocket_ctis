import {doquery, doqueryNew} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, skill_type_name FROM skilltype order by skill_type_name asc"; //for dropboxes
                    const {data, errors} = await doqueryNew({query: query});
                        res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                 payload = await checkUserType(session, req.query);
                if(payload?.user === "admin"){
                    try {
                        const {type_name} = req.body.skilltype;
                        const query = "INSERT INTO skilltype(skill_type_name) values (?)"
                        const data = await doquery({query: query, values: [type_name]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}