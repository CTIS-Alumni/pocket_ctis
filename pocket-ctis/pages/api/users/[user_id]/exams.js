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

const validation = (data) => {
    const currentDate = new Date();
    const examDate = data.start_date ? new Date(data.start_date) : null;

    if(examDate && examDate > currentDate)
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    return true;
}

export default async function handler(req, res){
    const auth_success = await checkAuth(req.headers, req.query);
    if(auth_success.user && (auth_success.user === "admin" || auth_success.user === "owner")){
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT ue.id, ex.exam_name, ue.grade, ue.visibility " +
                        "FROM userexam ue JOIN exam ex ON (ue.exam_id = ex.id) " +
                        "WHERE ue.user_id = ? order by ex.exam_name asc";

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
                    const exams = JSON.parse(req.body);
                    const base_query = "INSERT INTO userexam(user_id, exam_id, grade ";
                    const base_values = ["user_id", "exam_id", "grade"];
                    const optional_values = ["exam_date", "visibility"];
                    const queries = createPostQueries(exams, base_query, base_values, optional_values, user_id);
                    const select_queries = createGetQueries(exams, "userexam", ["exam_id", "exam_date", "grade"], user_id, true);
                    const {
                        data,
                        errors
                    } = await doMultiInsertQueries(queries, select_queries, "userexam", limitPerUser.exams, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const exams = JSON.parse(req.body);
                    const base_query = "UPDATE userexam SET exam_id = :exam_id, grade = :grade, ";
                    const base_values = ["exam_id", "grade"];
                    const optional_values = ["exam_date", "visibility"];
                    const queries = createPutQueries(exams, base_query, base_values, optional_values);
                    const select_queries = createGetQueries(exams, "userexam", ["exam_id", "exam_date", "grade"], user_id, false);
                    const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const exams = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM userexam WHERE id = ?";
                    exams.forEach((record) => {
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