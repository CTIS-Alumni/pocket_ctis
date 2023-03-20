import {addAndOrWhere, doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                let values = [];
                try {
                    let query = "select c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship " +
                        "FROM company c JOIN sector s on (c.sector_id = s.id) ";

                    if (req.query.sector_id) { //for a specific sectors page
                        query += " WHERE s.id = ? ";
                        values.push(req.query.sector_id);
                    }
                    if (req.query.name) { //for the general search
                        query += addAndOrWhere(query, " c.company_name LIKE CONCAT('%', ?, '%') ")
                        values.push(req.query.name);
                    }
                    if (req.query.internship) {//for the internships page
                        query += addAndOrWhere(query," c.is_internship = ? ")
                        values.push(req.query.internship);
                    }

                    query += " ORDER BY c.company_name ASC";

                    const data = await doquery({query: query, values: values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data, query});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                try {
                    const {company_name, sector_id, is_internship} = req.body.company;
                    const query = "INSERT INTO company(company_name, sector_id, is_internship) values(?,?,?)";
                    const data = await doquery({query: query, values: [company_name, sector_id, is_internship]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
        }
    }else {
        res.status(500).json({error: "Unauthorized"});
    }
}