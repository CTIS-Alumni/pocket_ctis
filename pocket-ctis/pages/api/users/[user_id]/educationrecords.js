import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    updateTable,
    insertToUserTable
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";


const field_conditions = {
    must_be_different: ["edu_inst_id", "degree_type_id", "name_of_program", "start_date", "end_date", "is_current", "gpa"],
    date_fields: ["start_date", "end_date"],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: [
        "edu_inst_id",
        "degree_type_id",
        "name_of_program",
        "education_description",
        "visibility",
        "is_current",
        "gpa"
    ],
    date: ["start_date", "end_date"]
};

const table_name = "educationrecord";

const validation = (data) => {
    replaceWithNull(data)
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(!data.edu_inst_id)
        return "Please select an education institute!";
    if (startDate && endDate && startDate > endDate)
        return "Start date can't be after end date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Please do not select future dates!";
    if(!data.name_of_program)
        return "Name of Program can't be empty!";
    if(endDate && data.is_current)
        return "Can't submit an end date for ongoing education!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid values for visibility!";
    if(data.is_current !== 0 && data.is_current !== 1)
        return "Invalid values for ongoing!";
    if(data.gpa < 0 || data.gpa > 4)
        return "Invalid values for gpa!";
    return true;
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const edu_records = JSON.parse(req.body);
                    const queries = buildInsertQueries(edu_records, table_name, fields ,user_id);
                    const select_queries = buildSelectQueries(edu_records, table_name,field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.education_records);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: {error: error.message}});
                }
                break;
            case "PUT":
                try {
                    const edu_records = JSON.parse(req.body);
                    const queries = buildUpdateQueries(edu_records, table_name, fields);
                    const select_queries = buildSelectQueries(edu_records, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors:[{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const edu_records = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(edu_records, table_name);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}