import {
    insertToUserTable,
    buildSelectQueries,
    updateTable,
    buildInsertQueries,
    buildUpdateQueries, doMultiDeleteQueries
} from "../../../../helpers/dbHelpers";
import  modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {corsMiddleware} from "../../middleware/cors";

const field_conditions = {
    must_be_different: ["certificate_name", "issuing_authority"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["certificate_name", "issuing_authority", "visibility"],
    date: []
};


const table_name = "usercertificate";

const validation = (data) => {
    replaceWithNull(data);
    if(data.visibility !== 1 && data.visibility !== 0)
        return "Invalid values for visibility!";
    if(!data.certificate_name || !data.issuing_authority)
        return "Please fill all fields!"
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const certificates = JSON.parse(req.body);
                    const queries = buildInsertQueries(certificates, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(certificates, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.certificates.limit_per_user);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const certificates = JSON.parse(req.body);
                    const queries = buildUpdateQueries(certificates, table_name, fields);
                    const select_queries = buildSelectQueries(certificates, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const certificates = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(certificates, table_name);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}
export default corsMiddleware(handler);