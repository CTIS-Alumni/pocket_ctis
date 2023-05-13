import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable, updateTable,
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

const field_conditions = {
    must_be_different: ["exam_id", "grade"],
    date_fields: ["exam_date"],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["exam_id", "grade", "visibility"],
    date: ["exam_date"]
};

const table_name = "userexam";

const validation = (data) => {
    replaceWithNull(data);
    const currentDate = new Date();
    const examDate = data.start_date ? new Date(data.start_date) : null;

    if(!data.grade === null)
        return "Invalid Values!";
    if(examDate && examDate > currentDate)
        return "Please do not select future dates!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid Values!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const exams = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const queries = buildInsertQueries(exams, table_name, fields, user_id);
                    const select_queries = buildSelectQueries(exams, table_name, field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, limitPerUser.exams);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(exams, table_name, fields);
                    const select_queries = buildSelectQueries(exams, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(exams, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    }else res.status(403).json({errors: [{error: "Forbidden action!"}]});
}