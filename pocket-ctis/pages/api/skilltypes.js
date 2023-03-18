import {doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, skill_type_name FROM skilltype order by skill_type_name asc"; //for dropboxes
                    const data = await doquery({query: query});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
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
                break;
        }
    } else {
        res.status(500).json({error: auth_success.error});
    }
}