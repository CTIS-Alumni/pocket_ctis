import {addAndOrWhere, buildSearchQuery, doMultiQueries, doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

const columns = {
    company_name: "c.company_name",
    sector_name: "s.sector_name"
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                let values = [], length_values = [];

                try {
                    let query = "SELECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship " +
                        "FROM company c JOIN sector s ON (c.sector_id = s.id) ";

                    let length_query = "SELECT COUNT(*) as count FROM company c JOIN sector s ON (c.sector_id = s.id) ";

                    if (req.query.sector_id) { //for a specific sectors page
                        query += " WHERE s.id = ? ";
                        length_query += "WHERE s.id = ? ";
                        values.push(req.query.sector_id);
                        length_values.push(req.query.sector_id);
                    }

                    if (req.query.internship) {//for the internships page
                        query += addAndOrWhere(query," c.is_internship = ? ");
                        length_query += addAndOrWhere(length_query, " c.is_internship = ? ");
                        values.push(req.query.internship);
                        length_values.push(req.query.internship);

                    }

                    if (req.query.name) { //for the general search
                        query += addAndOrWhere(query, " c.company_name LIKE CONCAT('%', ?, '%') ")
                        length_query += addAndOrWhere(length_query, " c.company_name LIKE CONCAT('%', ?, '%') ")
                        values.push(req.query.name);
                        length_values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

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