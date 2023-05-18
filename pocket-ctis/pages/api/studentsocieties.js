import {
    buildInsertQueries,
    buildSearchQuery,
    doMultiDeleteQueries, doMultiQueries,
    doqueryNew,
    insertToTable
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import modules from "../../config/moduleConfig";

const table_name = "studentsociety";

const fields = {
    basic: ["society_name", "description"],
    date: []
}

const columns ={
    society_name: "society_name",
    description: "description"
}

const validation = (data) => {
    replaceWithNull(data);
    if(!data.society_name)
        return "Society name can't be empty!";
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
                    let query = "SELECT * FROM studentsociety order by society_name asc ";
                    let length_query = "SELECT COUNT(*) FROM studentsociety ";

                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "POST":
                payload = await checkUserType(session, req.query);
                if(payload?.user === "admin" || modules.student_societies.user_addable) {
                    try {
                        const {societies} = JSON.parse(req.body);
                        const queries = buildInsertQueries(societies, table_name, fields);
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
                        const {societies} = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(societies, table_name);
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
export default checkApiKey(handler);