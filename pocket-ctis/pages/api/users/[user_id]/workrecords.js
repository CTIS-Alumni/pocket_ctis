import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    InsertToUser, updateTable,
    doMultiQueries,
    doquery, insertToUser
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

const field_conditions = {
    must_be_different: ["company_id", "work_type_id", "department", "position", "city_id", "country_id","is_current"],
    date_fields: ["start_date", "end_date"],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: [
        "work_type_id",
        "company_id",
        "department",
        "position",
        "work_description",
        "city_id",
        "country_id",
        "visibility",
        "is_current"
    ],
    date: ["start_date", "end_date"]
};

const table_name = "workrecord";

const validation = (data) => {
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(data.work_type_id !== 3 && !data.company_id)
        return false;
    if (startDate && endDate && startDate > endDate)
        return false;
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return false;
    if(endDate && data.is_current) //if its ongoing it cant have endDate
        return false;
    if(data.is_current !== 0 && data.is_current !== 1)
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);

    if(payload.user === "admin" || payload.user === "owner") {
        const work_records = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;

        switch (method) {
            case "POST":
                try {
                    const select_queries = buildSelectQueries(work_records, table_name,field_conditions);
                    const queries = buildInsertQueries(work_records, table_name, fields, user_id);
                    const {data, errors} = await insertToUser(queries, table_name, validation,  select_queries, limitPerUser.work_records);
                    res.status(200).json({data, errors, queries, select_queries});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const queries = buildUpdateQueries(work_records, table_name, fields);
                    const select_queries = buildSelectQueries(work_records, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const {data, errors} = await doMultiDeleteQueries(work_records, table_name);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}