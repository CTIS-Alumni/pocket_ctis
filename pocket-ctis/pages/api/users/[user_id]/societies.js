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
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    if(data.activity_status !== 0 && data.activity_status !== 1)
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
                    const query = "SELECT uss.id, ss.society_name, uss.activity_status, uss.visibility " +
                        "FROM userstudentsociety uss JOIN studentsociety ss ON (uss.society_id = ss.id) " +
                        "WHERE uss.user_id = ? order by ss.society_name asc";
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
                    const societies = JSON.parse(req.body);
                    const base_query = "INSERT INTO userstudentsociety(user_id, society_id, activity_status ";
                    const base_values = ["user_id", "society_id", "activity_status"];
                    const optional_values = ["visibility"];
                    const select_queries = createGetQueries(societies, "userstudentsociety", ["society_id"], user_id, true);
                    const queries = createPostQueries(societies, base_query, base_values, optional_values, user_id);
                    const {
                        data,
                        errors
                    } = await doMultiInsertQueries(queries, select_queries, "userstudentsociety", limitPerUser.student_societies, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const societies = JSON.parse(req.body);
                    const base_query = "UPDATE userstudentsociety SET society_id = :society_id, activity_status = :activity_status, ";
                    const base_values = ["society_id", "activity_status"];
                    const optional_values = ["visibility"];
                    const queries = createPutQueries(societies, base_query, base_values, optional_values);
                    const select_queries = createGetQueries(societies, "userstudentsociety", ["skill_id"], user_id, false);
                    const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const societies = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM userstudentsociety WHERE id = ? ";
                    societies.forEach((society) => {
                        queries.push({
                            name: society.id,
                            query: tempQuery,
                            values: [society.id]
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