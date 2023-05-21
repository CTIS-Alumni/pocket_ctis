import {
    buildInsertQueries,
    buildSearchQuery,
    buildUpdateQueries, doMultiDeleteQueries,
    doMultiQueries,
    doqueryNew,
    insertToTable, updateTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import modules from "../../config/moduleConfig";
import {corsMiddleware} from "./middleware/cors";

const table_name = "exam";

const fields = {
    basic: ["exam_name"],
    date: []
}

const columns = {
    exam_name: "exam_name",
    id: "id"
}

const validation = (data) => {
    replaceWithNull(data);
    if(!data.exam_name)
        return "Exam name can't be empty!"
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT * FROM exam ";
                    let length_query = "SELECT COUNT(*) as count FROM exam ";
                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin") {
                    try{
                        const {exams} = JSON.parse(req.body);
                        const queries = buildUpdateQueries(exams, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin" || modules.exams.user_addable) {
                    try {
                        const {exams} = JSON.parse(req.body);
                        const queries = buildInsertQueries(exams, table_name, fields);
                        const {data, errors} = await insertToTable(queries, table_name, validation);
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "DELETE":
                payload = await checkUserType(session)
                if(payload.user === "admin"){
                    try {
                        const {exams} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(exams, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]})
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));