import {doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res){
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
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
        }
    }else{
        res.status(500).json({error: auth_success.error});
    }
}