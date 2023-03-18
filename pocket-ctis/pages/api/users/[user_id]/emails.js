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
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email_regex.test(data.email_address))
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
                    const query = "SELECT  id, email_address, visibility FROM useremail WHERE user_id = ? order by email_address asc";
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
                    const emails = JSON.parse(req.body);
                    const base_query = "INSERT INTO useremail(user_id, email_address ";
                    const base_values = ["user_id", "email_address"];
                    const optional_values = ["visibility"];
                    const queries = createPostQueries(emails, base_query, base_values, optional_values, user_id);
                    const select_queries = createGetQueries(emails, "useremail", ["email_address"], user_id, true, true);
                    const {
                        data,
                        errors
                    } = await doMultiInsertQueries(queries, select_queries, "useremail", limitPerUser.emails, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const emails = JSON.parse(req.body);
                    const base_query = "UPDATE useremail SET email_address = :email_address, ";
                    const base_values = ["email_address"];
                    const optional_values = ["visibility"];
                    const queries = createPutQueries(emails, base_query, base_values, optional_values);
                    const select_queries = createGetQueries(emails, "useremail", ["email_address"], user_id, false, true);
                    const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const emails = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM useremail WHERE id = ?";
                    emails.forEach((e) => {
                        queries.push({
                            name: e.id,
                            query: tempQuery,
                            values: [e.id]
                        });
                    });
                    const {data, errors} = await doMultiQueries(queries);
                    res.status(200).json({data, errors});
                } catch (errors) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: auth_success});
    }
}