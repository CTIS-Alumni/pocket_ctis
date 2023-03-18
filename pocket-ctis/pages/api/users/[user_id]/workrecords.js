import {
    createGetQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries, doMultiPutQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth} from "../../../../helpers/authHelper";

const fields_to_check = [
    "work_type_id",
    "company_id",
    "department",
    "position",
    "city_id",
    "country_id",
    "start_date",
    "end_date",
    "is_current"
];

const validation = (data) => {
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if((data.work_type_id === 1 || data.work_type_id === 2) && !data.company_id)
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
    const auth_success = await checkAuth(req.headers, req.query);
    if(auth_success.user && (auth_success.user === "admin" || auth_success.user === "owner")) {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT w.id, c.company_name, wt.work_type_name, w.department, w.position, w.work_description, ci.city_name, co.country_name, w.start_date, w.end_date, w.visibility, w.is_current " +
                        "FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                        "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                        "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                        "WHERE w.user_id = ? order by w.start_date desc";

                    const data = await doquery({query: query, values: [user_id]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                try {
                    const work_records = JSON.parse(req.body);
                    const base_query = "INSERT INTO workrecord(user_id, work_type_id ";
                    const base_values = ["user_id", "work_type_id"];
                    const optional_values = ["company_id", "department", "position", "work_description", "city_id", "country_id", "start_date", "end_date", "visibility", "is_current"];
                    const select_queries = createGetQueries(work_records, "workrecord", fields_to_check, user_id, true);
                    const queries = createPostQueries(work_records, base_query, base_values, optional_values, user_id);
                    const {
                        data,
                        errors
                    } = await doMultiInsertQueries(queries, select_queries, "workrecord", limitPerUser.work_records, validation);
                    res.status(200).json({data, errors, queries, select_queries});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const work_records = JSON.parse(req.body);
                    const base_query = "UPDATE workrecord SET work_type_id = :work_type_id, ";
                    const base_values = ["work_type_id"];
                    const optional_values = ["company_id", "department", "position", "work_description", "city_id", "country_id", "start_date", "end_date", "visibility", "is_current"];
                    const queries = createPutQueries(work_records, base_query, base_values, optional_values);
                    const select_queries = createGetQueries(work_records, "workrecord", fields_to_check, user_id, false)
                    const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const work_records = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM workrecord WHERE id = ?";
                    work_records.forEach((record) => {
                        queries.push({
                            name: record.id,
                            query: tempQuery,
                            values: [record.id]
                        });
                    });
                    const {data, errors} = await doMultiQueries(queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: auth_success});
    }
}