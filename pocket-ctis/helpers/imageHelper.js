import formidable from "formidable";
import fs from "fs/promises";
import Jimp, {read} from "jimp";

export const parseFormForDB = (req, file_names, file_map) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;

        try{
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    const obj = {};
                    for (const [field, value] of Object.entries(fields)) {
                        obj[field] = value;
                    }

                    const file_objects = [];
                    for (const [field, value] of Object.entries(files)){
                        file_objects[field] = {[field]: value, name: file_map[field]['name'], location: file_map[field]['location']};
                    }

                    resolve({ obj, file_objects });
                }
            });
        }catch(err){
            reject(err)
        }
    });
}

export const resizeAndCropImage = async (file, targetWidth, targetHeight) => { //Returns buffer

    const fileBuffer = await fs.readFile(file.filepath);
    const img = await read(fileBuffer);

    img.cover(targetWidth, targetHeight);
    const mimeType = img.getMIME();

    const resizedImageBuffer = await img.getBufferAsync(mimeType);
    return resizedImageBuffer;

}
