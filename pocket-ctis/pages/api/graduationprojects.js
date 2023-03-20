import {
    doMultiDeleteQueries,
    insertToTable, updateTable,
    doquery, buildSelectQueries, buildInsertQueries, buildUpdateQueries
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

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
        "advisor",
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
                    let values = [];
                    let query = "SELECT g.id, g.graduation_project_name, g.team_number, g.project_year, g.semester, g.advisor, g.project_type, g.company_id, c.company_name " +
                        "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) ";

                    if (req.query.name) {
                        query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        values.push(req.query.name);
                    }

                    query += "ORDER by g.project_year";

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