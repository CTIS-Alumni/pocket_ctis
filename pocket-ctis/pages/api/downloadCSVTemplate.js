import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {corsMiddleware} from "./middleware/cors";
import fs from 'fs';
import { createReadStream } from 'fs';

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session && payload.user === "admin") {
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const {template_type} = JSON.parse(req.body);

                    const template_path = process.env.PRIVATE_ASSETS_PATH + "/CSVtemplates/" + template_type + ".csv";

                    res.setHeader('Content-disposition', 'attachment; filename=example.csv');
                    res.setHeader('Content-type', 'text/csv');

                    const fileData = fs.readFileSync(template_path);
                    const base64Data = fileData.toString('base64');
                    const responseData = { fileData: base64Data };
                    res.status(200).json(responseData);

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });

        }
    } else {
        res.status(403).json({errors: [{error: "Forbidden request!"}]})
    }
}


export default corsMiddleware(checkApiKey(handler));