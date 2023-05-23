import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import fs from 'fs/promises';
import {corsMiddleware} from "./middleware/cors";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        if(payload.user === "admin"){
            const method = req.method;
            switch (method) {
                case "POST":
                    try {
                        const {modules} = JSON.parse(req.body);
                        const fileContents = `module.exports = ${JSON.stringify(modules, null, 2)};\n`;
                        await fs.writeFile(process.env.MODULE_CONFIG_PATH, fileContents, 'utf8');
                        res.status(200).json({data: modules});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                    break;
                default:
                    res.status(404).json({ errors: [{ error: "Invalid method" }] });
            }
        } res.status(403).json({errors: [{error: "Forbidden request!"}]});
    } else res.redirect("/401", 401);
}
export default corsMiddleware(checkApiKey(handler));