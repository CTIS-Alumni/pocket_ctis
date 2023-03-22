import {
    doMultiDeleteQueries,
    insertToTable, updateTable,
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, buildSearchQuery, doMultiQueries
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

const columns = {
    project_name: "g.graduation_project_name",
    company: "c.company_name",
    advisor: "CONCAT(u.first_name, ' ', u.nee, ' ', u.last_name)",
    year: "g.project_year"
}

const field_conditions = {
    must_be_different: ["graduation_project_name", "product_name"],
    date_fields: [],
    user: {
        check_user_only: false,
        user_id: null
    }
}

const fields = {
    basic: ["graduation_project_name",
        "team_number",
        "product_name",
        "project_year",
        "semester",
        "project_description",
        "advisor_id",
        "project_type",
        "company_id"],
    date: []
};

const table_name = "graduationproject";

const validation = (data) => {
    if(data.product_name !== null && data.product_name.trim() === "")
        return false;
    if(data.project_description != null && data.project_description.trim() === "")
        return false;
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload, grad_projects = [];
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT g.id, g.graduation_project_name, g.team_number, g.project_year, g.semester, CONCAT(u.first_name, ' ' ,u.last_name) as advisor, g.project_type, g.company_id, c.company_name " +
                        "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) JOIN users u ON (u.id = g.advisor_id)";
                    let length_query = "SELECT COUNT(*) as count from graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) " +
                        "JOIN users u ON (u.id = g.advisor_id) ";

                    if (req.query.name) {
                        query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        length_query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        length_values.push(req.query.name);
                        values.push(req.query.name);
                    }

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} = await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.data.length, errors: errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if (payload.user === "admin") {
                    try {
                        grad_projects = JSON.parse(req.body);
                        const select_queries = buildSelectQueries(grad_projects, table_name, field_conditions);
                        const queries = buildInsertQueries(grad_projects, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation, select_queries);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if (payload.user === "admin") {
                    try {
                        grad_projects = JSON.parse(req.body);
                        const queries = buildUpdateQueries(grad_projects,table_name, fields);
                        const select_queries = buildSelectQueries(grad_projects, table_name, field_conditions);
                        const {data, errors} = await updateTable(queries, validation, select_queries);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error: "Unauthorized"});
                }
                break;
            case "DELETE":
                try{
                    grad_projects = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(grad_projects, table_name);
                    res.status(200).json({data, errors});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
                break;
        }
    } else {
        res.status(500).json({error: "Unauthorized"});
    }
}