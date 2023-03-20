import {doquery} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [];
                    let query = "SELECT * FROM sector ";

                    if (req.query.name) { // for general search
                        query += " WHERE sector_name LIKE CONCAT('%', ?, '%') ";
                        values.push(req.query.name);
                    }

                    query += "ORDER BY sector_name ASC ";
                    const data = await doquery({query: query, values: values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload.user === "admin") {
                    try {
                        const {sector_name} = req.body.sector;
                        const query = "INSERT INTO sector(sector_name) values(?)";
                        const data = await doquery({query: query, values: [sector_name]});
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
        }
    }else{
        res.status(500).json({error: "Unauthorized"});
    }
}