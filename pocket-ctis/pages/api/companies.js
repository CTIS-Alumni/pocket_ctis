import {
    addAndOrWhere,
    buildInsertQueries,
    buildSearchQuery, buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    insertToTable, updateTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import modules from "../../config/moduleConfig";

const columns = {
    company_name: "c.company_name",
    id: "c.id",
    sector_name: "s.sector_name",
    sector_id: "c.sector_id",
    is_internship: "c.is_internship"
}

const table_name = "company";

const fields = {
    basic: ["company_name", "sector_id", "is_internship"],
    date: []
}

const validation = (data) => {
    replaceWithNull(data)
    if(!data.company_name)
        return "Company name can't be empty!";
    if(isNaN(parseInt(data.sector_id)))
        return "Sector ID must be a number!";
    if(isNaN(parseInt(data.is_internship)) || (parseInt(data.is_internship) !== 1 && parseInt(data.is_internship) !== 0))
        return "Invalid value for internship field!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                let values = [], length_values = [];

                try {
                    let query = "SELECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship ";

                        if(req.query.internship){
                            query += ", AVG(i.rating) AS rating ";
                    }
                        query += "FROM company c JOIN sector s ON (c.sector_id = s.id) ";

                    let length_query = "SELECT COUNT(DISTINCT c.id) as count FROM company c JOIN sector s ON (c.sector_id = s.id) ";

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
                    console.log("hers the query until now", query, "hers the lenght query until now", length_query);

                    if (req.query.name) { //for the general search
                        query += addAndOrWhere(query, " c.company_name LIKE CONCAT('%', ?, '%') ")
                        length_query += addAndOrWhere(length_query, " c.company_name LIKE CONCAT('%', ?, '%') ")
                        values.push(req.query.name);
                        length_values.push(req.query.name);
                    }

                    if(req.query.internship){
                        query += " GROUP BY c.id ";
                    }


                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    console.log("query: ", query, "values: ", values, "lenght", length_query, "lenght values", length_values);

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    if(req.query.internship && payload.user !== "admin" && !modules.internships.user_visible){
                        data.data = [];
                        data.length[0].count = 0;
                    }

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                if(payload?.user === "admin") {
                    try{
                        const {companies} = JSON.parse(req.body);
                        const queries = buildUpdateQueries(companies, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "POST":
                if(payload.user === "admin" || modules.companies.user_addable){
                    try {
                        const {companies} = JSON.parse(req.body);
                        const queries = buildInsertQueries(companies, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
            case "DELETE":
                if(payload.user === "admin"){
                    try {
                        const {companies} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(companies, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
        }
    }else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);