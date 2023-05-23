import {
    buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable,
    updateTable,
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {corsMiddleware} from "../../middleware/cors";

const table_name = "userhighschool";

const fields = {
    basic: ["high_school_id", "visibility"],
    date: []
};

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return "Invalid values for visibility!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const high_schools = JSON.parse(req.body);
                    const queries = buildInsertQueries(high_schools, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const high_schools = JSON.parse(req.body);
                    const queries = buildUpdateQueries(high_schools, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const high_schools = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(high_schools, table_name);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    } res.status(403).json({errors: [{error: "Forbidden request!"}]});
}
export default corsMiddleware(handler);