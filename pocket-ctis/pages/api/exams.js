import {doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT * FROM exam order by exam_name asc";
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
                    const {exam_name} = req.body.exam;
                    const query = "INSERT INTO exam(exam_name) values (?)";
                    const data = await doquery({query: query, values: [exam_name]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
        }
    } else {
        res.status(500).json({error: auth_success.error});
    }
}