import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res) {

        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.columns WHERE table_schema = DATABASE() ORDER BY table_name, ordinal_position";
                    const data = await doquery({query: query, values: []});
                    res.status(200).json({data});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }

}