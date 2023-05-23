import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {getBufferImage, parseFormForDB, resizeAndCropImage, resizeAndFitImage} from "../../helpers/imageHelper";
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import departmentConfig from '../../config/departmentConfig'
import {corsMiddleware} from "./middleware/cors";

export const config = {
    api: {
        bodyParser: false,
    },
};

const fields = ['department_name', 'abbreviation', 'app_name', 'app_logo']
//Written entirely and only by Sila Yapici and Iqbal Karim
const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        if(payload.user === "admin"){
            const method = req.method;
            switch (method) {
                case "POST":
                    try {
                        const file_map = {
                            appImage: {
                                name: '',
                                location: '/departmentPictures/app_logo'
                            }}
                        const { obj, file_objects } = await parseFormForDB(req, fields.basic, file_map);

                        if(obj.show_current === "undefined")
                            obj.show_current = false;

                        if(file_objects?.appImage) {
                            const files = await fsPromises.readdir(process.env.SAVE_IMAGES_PATH + "/departmentPictures/app_logo");
                            for (const file of files) {
                                if (departmentConfig.app_logo !== file_objects.appImage.appImage.originalFilename) {
                                    await fsPromises.unlink(process.env.SAVE_IMAGES_PATH + "/departmentPictures/app_logo/" + file);
                                }
                            }
                            const destinationFilePath = process.env.SAVE_IMAGES_PATH + file_objects.appImage.location + "/" + file_objects.appImage.appImage.originalFilename;
                            const resizedBuffer = await resizeAndFitImage(file_objects.appImage.appImage, 250, 75);
                            await fsPromises.writeFile(destinationFilePath, resizedBuffer);
                        }else if(!obj.show_current && departmentConfig.app_logo !== ""){
                            const files = await fsPromises.readdir(process.env.SAVE_IMAGES_PATH + "/departmentPictures/app_logo");
                            for (const file of files) {
                                    await fsPromises.unlink(process.env.SAVE_IMAGES_PATH + "/departmentPictures/app_logo/" + file);
                                }
                        }

                        delete obj.appImage;
                        delete obj.show_current;
                        const fileContents = `module.exports = ${JSON.stringify(obj, null, 2)};\n`;
                        await fsPromises.writeFile(process.env.DEPARTMENT_CONFIG_PATH, fileContents, 'utf8');

                        res.status(200).json({data: obj});

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