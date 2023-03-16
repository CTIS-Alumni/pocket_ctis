import {
    createGetQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries, doMultiPutQueries,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';

const fields_to_check = [
    "edu_inst_id",
    "degree_type_id",
    "name_of_program",
    "start_date",
    "end_date",
    "is_current",
]

const validation = (data) => {
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (startDate && endDate && startDate > endDate)
        return false;
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return false;
    if(endDate && data.is_current)
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    if(data.is_current !== 0 && data.is_current !== 1)
        return false;
    if(data.name_of_program.trim() == "")
        return false;
    return true;
}

export default async function handler(req, res) {
    const api_key = req.headers['x-api-key'];
    if (api_key === undefined || api_key !== process.env.API_KEY) {
        res.status(401).json({message: "Unauthorized user!"});
    }
    const {user_id} = req.query;
    const method = req.method;
    switch (method) {
        case "GET":
            try {
                const query = "SELECT e.id, e.edu_inst_id, ei.edu_inst_name, d.degree_type_name, e.name_of_program, e.education_description, e.start_date, e.end_date, e.visibility, e.is_current, " +
                    "ci.city_name, co.country_name  " +
                    "FROM educationrecord e " +
                    "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id)  " +
                    "JOIN degreetype d ON (e.degree_type_id = d.id)  " +
                    "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE e.user_id = ? order by e.start_date desc ";

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
                const edu_records = JSON.parse(req.body);
                const base_query = "INSERT INTO educationrecord(user_id, edu_inst_id, degree_type_id, name_of_program ";
                const base_values = ["user_id", "edu_inst_id", "degree_type_id", "name_of_program"];
                const optional_values = ["education_description","start_date", "end_date", "visibility","is_current"];
                const queries = createPostQueries(edu_records, base_query, base_values, optional_values, user_id);
                const select_queries = createGetQueries(edu_records, "educationrecord", fields_to_check, user_id, true)
                const {data, errors} = await doMultiInsertQueries(queries, select_queries, "educationrecord", limitPerUser.education_records, validation);
                res.status(200).json({data, errors});

            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try {
                const edu_records = JSON.parse(req.body);
                const base_query = "UPDATE educationrecord SET edu_inst_id = :edu_inst_id, degree_type_id = :degree_type_id, name_of_program = :name_of_program, ";
                const base_values = ["edu_inst_id", "degree_type_id", "name_of_program"];
                const optional_values = ["education_description","start_date", "end_date", "visibility","is_current"];
                const queries = createPutQueries(edu_records, base_query, base_values, optional_values);
                const select_queries = createGetQueries(edu_records, "educationrecord", fields_to_check, user_id, false);
                const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                res.status(200).json({data, errors});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try {
                const edu_records = JSON.parse(req.body);
                let queries = [];
                const tempQuery = "DELETE FROM educationrecord WHERE id = ?"
                edu_records.forEach((record) => {
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
}