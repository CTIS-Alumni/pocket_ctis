import {
    buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable, updateTable,
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {corsMiddleware} from "../../middleware/cors";

const fields = {
    basic: ["phone_number", "visibility"],
    date: []
};


const table_name = "userphone";

const validation = (data) => {
    replaceWithNull(data);
    if(data.visibility !== 1 && data.visibility !== 0)
        return "Invalid values for visibility!";
    if(!data.phone_number)
        return "Phone number can't be empty!";
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
                    const phones = JSON.parse(req.body);
                    const queries = buildInsertQueries(phones, table_name, fields, user_id);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, [], modules.user_profile_data.phone_numbers.limit_per_user);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const phones = JSON.parse(req.body);
                    const queries = buildUpdateQueries(phones, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const phones = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(phones, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}

export default corsMiddleware(handler);