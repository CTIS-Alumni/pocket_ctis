import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../helpers/authHelper";
import {checkApiKey} from "../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        const {company_id} = req.query;
        switch (method) {
            case "GET":
                try {
                    const query = "SElECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship FROM company c JOIN sector s on (c.sector_id = s.id) WHERE c.id = ?";
                    //use sector_id as link to that sector
                    const {data,errors} = await doqueryNew({query: query, values: [company_id]});
                    res.status(200).json({data: data[0] || null, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const {company_name, sector_id, is_internship} = req.body.company;
                        const query = "UPDATE company SET company_name = ?, sector_id = ?, is_internship = ? WHERE id = ?"
                        const data = await doquery({
                            query: query,
                            values: [company_name, sector_id, is_internship, company_id]
                        });
                        res.status(200).json({message: data});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else {
                    res.redirect("/401", 401);
                }
                break;
            case "DELETE":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const query = "DELETE FROM company WHERE id = ?"
                        const data = await doquery({query: query, values: [company_id]});
                        res.status(200).json({message: data});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                    break;
                } else {
                    res.redirect("/401", 401);
                }
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);