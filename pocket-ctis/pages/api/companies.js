import {
    addAndOrWhere,
    buildInsertQueries,
    buildSearchQuery,
    doMultiQueries,
    insertToTable
} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const columns = {
    company_name: "c.company_name",
    sector_name: "s.sector_name"
}

const table_name = "company";

const fields = {
    basic: ["company_name", "sector_id", "is_internship"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data)
    if(!data.company_name)
        return "Company Name can't be empty!";
    if(isNaN(parseInt(data.sector_id)))
        return "Sector Id must be a number!";
    if(isNaN(parseInt(data.is_internship)) || (parseInt(data.is_internship) !== 1 && parseInt(data.is_internship) !== 0))
        return "Invalid value for internship field!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                let values = [], length_values = [];

                try {
                    let query = "SELECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship ";

                        if(req.query.internship){
                            query += " AVG(i.rating) AS rating ";
                    }
                        query += "FROM company c JOIN sector s ON (c.sector_id = s.id) ";

                    let length_query = "SELECT COUNT(*) as count FROM company c JOIN sector s ON (c.sector_id = s.id) ";

                    if (req.query.sector_id) { //for a specific sectors page
                        query += " WHERE s.id = ? ";
                        length_query += "WHERE s.id = ? ";
                        values.push(req.query.sector_id);
                        length_values.push(req.query.sector_id);
                    }

                    if (req.query.internship) {//for the internships page
                        query += " LEFT OUTER JOIN internshiprecord i ON (i.company_id = c.id) ";
                        query += addAndOrWhere(query," c.is_internship = ? ");
                        length_query += " LEFT OUTER JOIN internshiprecord i ON (i.company_id = c.id) ";
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

                    if(req.query.internship){
                        query += " GROUP BY c.id";
                        length_query += " GROUP BY c.id";
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                try {
                    const {companies} = JSON.parse(req.body);
                    const queries = buildInsertQueries(companies, table_name, fields);
                    const {data, errors} = await insertToTable(queries, table_name, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
        }
    }else {
        res.redirect("/401", 401);
    }
}