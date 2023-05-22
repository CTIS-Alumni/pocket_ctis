import {
    buildSelectQueries,
    buildInsertQueries,
    buildUpdateQueries,
    doMultiDeleteQueries,
    updateTable,
    insertToUserTable, doqueryNew
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import modules from '../../../../config/moduleConfig.js';
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {corsMiddleware} from "../../middleware/cors";

const field_conditions = {
    must_be_different: ["edu_inst_id", "semester"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["edu_inst_id", "semester", "rating", "opinion", "visibility"],
    date: ["start_date", "end_date"]
};


const table_name = "erasmusrecord";

const validation = (data) => {
    replaceWithNull(data);
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(!data.edu_inst_id)
        return "Please select an education institute!";
    if(!data.start_date)
        return "Please enter a start date!"
    if (endDate && startDate > endDate)
        return "Start date can't be after end date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Please do not select future dates!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid value for visibility!";
    if(data.rating < 0 || data.rating > 5 || (data.rating % 0.5) !== 0)
        return "Invalid values for rating!";
    if(!data.semester === null)
        return "Semester can't be empty!";
    return true;
}
const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id
        const method = req.method;
        switch (method) {
            case "POST":
                if(payload?.user === "admin"){
                    try {
                        const erasmus = JSON.parse(req.body);
                        const select_queries = buildSelectQueries(erasmus, table_name,field_conditions);
                        const queries = buildInsertQueries(erasmus, table_name, fields, user_id);
                        const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.erasmus.limit_per_user);
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: {error: error.message}});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "PUT":
                try{
                    if(payload?.user === "owner"){
                        fields.basic = ["rating", "opinion","visibility"];
                        fields.date = [];
                    }
                    const erasmus = JSON.parse(req.body);
                    const queries = buildUpdateQueries(erasmus, table_name, fields);
                    const select_queries = buildSelectQueries(erasmus, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                }catch(error){
                    res.status(500).json({errors: [{error:error.message}] });
                }
                break;
            case "DELETE":
                if(payload?.user === "admin"){
                    try{
                        const erasmus = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(erasmus, table_name);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}
export default corsMiddleware(handler);