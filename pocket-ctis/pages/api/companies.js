import {doquery} from "../../helpers/dbconnect";

const columns = {
    company_name: "c.company_name",
    sector_name: "s.sector_name"
}

export default async function handler(req, res) {
    const api_key = req.headers['x-api-key'];
    if (api_key === undefined || api_key !== process.env.API_KEY) {
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch (method) {
        case "GET":
            let values = [];
            let count_values = [];
            try {
                let query;
                let count_query;


                count_query = "SELECT COUNT(c.id) as count ";
                query = "SELECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship ";

                query += "FROM company c JOIN sector s on (c.sector_id = s.id) ";
                count_query += "FROM company c JOIN sector s on (c.sector_id = s.id) ";
                if (req.query.sector_id) {
                    query += "WHERE s.id = ? ";
                    count_query += "WHERE s.id = ? ";
                    values.push(req.query.sector_id);
                    count_values.push(req.query.sector_id);
                }
                if (req.query.name) {
                    if (query.indexOf("WHERE") !== -1)
                        query += "AND c.company_name LIKE CONCAT('%', ?, '%') "
                    else query += "WHERE c.company_name LIKE CONCAT('%', ?, '%') ";
                    if(count_query.indexOf("WHERE") !== -1)
                        count_query += "AND c.company_name LIKE CONCAT('%', ?, '%') ";
                    else count_query += "WHERE c.company_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                    count_values.push(req.query.name);
                }

                if(req.query.searchcol && req.query.search){
                    const cols = req.query.searchcol.split(",");
                    let searchColumns = [];
                    cols.forEach((column)=>{
                        if(!columns.hasOwnProperty(column))
                            res.status(500).json({error: "Error in search column!"});
                        searchColumns.push(columns[column]);
                    });
                    if (query.indexOf("WHERE") !== -1)
                        query += "AND ( ";
                    else query += "WHERE ( ";
                    if (count_query.indexOf("WHERE") !== -1)
                        query += "AND ( ";
                    else query += "WHERE ( ";
                    searchColumns.forEach(function(column){
                        query += column + " LIKE CONCAT('%', ?, '%') "
                        count_query += column + " LIKE CONCAT('%', ?, '%') ";
                        if(column !== searchColumns[searchColumns.length - 1])
                        {
                            query += "OR ";
                            count_query += "OR";
                        }
                        values.push(req.query.search);
                        count_values.push(req.query.search);
                    });
                    query += ") ";
                    count_query += ") ";
                }

                if (req.query.internship) {
                    if (query.indexOf("WHERE") !== -1)
                        query += "AND c.is_internship = ? "
                    else query += "WHERE c.is_internship = ? ";
                    if (count_query.indexOf("WHERE") !== -1)
                        count_query += "AND c.is_internship = ? "
                    else count_query += "WHERE c.is_internship = ? ";
                    values.push(req.query.internship);
                    count_values.push(req.query.internship);
                }

                if (req.query.column && columns.hasOwnProperty(req.query.column) && req.query.order && (req.query.order === "asc" ||req.query.order === "desc")) {
                    query += "ORDER BY " + columns[req.query.column] + " " + req.query.order + " ";
                }

                if (req.query.offset && req.query.limit) {
                    query += "LIMIT ? OFFSET ? ";
                    values.push(req.query.limit);
                    values.push(req.query.offset);
                }

                const data = await doquery({query: query, values: values});
                const length = await doquery({query: count_query, values: count_values});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data: data, length: length[0].count});
            }catch(error){
                res.status(500).json({error: error.message, query: req.query});
            }
            break;
        case "POST":
            try{
                const {company_name, sector_id, is_internship} = req.body.company;
                const query = "INSERT INTO company(company_name, sector_id, is_internship) values(?,?,?)";
                const data = await doquery({query: query, values: [company_name, sector_id, is_internship]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}