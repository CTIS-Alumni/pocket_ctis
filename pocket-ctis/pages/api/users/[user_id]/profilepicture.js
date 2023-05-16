import {
    doqueryNew,
    insertWithImage
} from "../../../../helpers/dbHelpers";
import { checkAuth, checkUserType } from "../../../../helpers/authHelper";
import fs from 'fs/promises'
import {parseFormForDB} from '../../../../helpers/imageHelper';
import Jimp, {read} from 'jimp';

const fields = {
    basic: ["profile_picture, visibility"],
    date: []
}

const validation = (data) => {
    if(data.visibility != 0 && data.visibility !== 1)
        return "Invalid values for visibility!";
    return true;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    try {
        const session = await checkAuth(req.headers, res);
        const payload = await checkUserType(session, req.query);
        if (payload?.user === "admin" || payload?.user === "owner") {
            const { user_id } = req.query;
            const method = req.method;
            switch (method) {
                case "PUT":
                    if (req.query.removePic) {
                        const query = "UPDATE userprofilepicture SET profile_picture = 'defaultuser' WHERE user_id = ?";
                        const { data, errors } = await doqueryNew({ query: query, values: [user_id] });

                        if (errors || !data)
                            throw errors[0];

                        await fs.unlink(process.env.PUBLIC_IMAGES_PATH + "/profilepictures/" + user_id + ".png");

                        res.status(200).json({ data, errors });

                    } else {
                        const file_map = {
                            image: {
                                name: user_id,
                                location: '/profilepictures'
                            }}

                        const { obj, file_objects } = await parseFormForDB(req, fields.basic, file_map);
                        const query = "UPDATE userprofilepicture SET profile_picture = :profile_picture, visibility = :visibility WHERE user_id = :user_id";
                        obj.user_id = user_id;

                        const {data, errors} = await insertWithImage(query, obj, validation, file_objects, 250, 250);

                        res.status(200).json({ data: data || [], errors: errors || [] });
                    }
                    break;
                default:
                    res.status(404).json({ errors: [{ error: "Invalid method" }] });
            }
        } else {
            res.status(403).json({ errors: [{ error: "Forbidden request!" }] });
        }
    } catch (error) {
        res.status(500).json({ errors: [{ error: error.message }] });
    }
}
