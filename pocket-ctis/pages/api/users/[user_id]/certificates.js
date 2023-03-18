import {
    doquery,
    doMultiQueries,
    createPostQueries,
    createPutQueries,
    doMultiInsertQueries, createGetQueries, doMultiPutQueries
} from "../../../../helpers/dbHelpers";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {checkAuth} from "../../../../helpers/authHelper";

const validation = (data) => {
    if(data.visibility !== 1 && data.visibility !== 0)
        return false;
    if(data.certificate_name.trim() == "" || data.issuing_authority.trim() == "")
        return false;
    return true;
}

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if(auth_success.user && (auth_success.user === "admin" || auth_success.user === "owner")){
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT id, certificate_name, issuing_authority, visibility " +
                        "FROM usercertificate WHERE user_id = ? order by certificate_name asc";
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
                    const certificates = JSON.parse(req.body);
                    const base_query = "INSERT INTO usercertificate(user_id, certificate_name, issuing_authority ";
                    const base_values = ["user_id", "certificate_name", "issuing_authority"];
                    const optional_values = ["visibility"];
                    const queries = createPostQueries(certificates, base_query, base_values, optional_values, user_id, true);
                    const select_queries = createGetQueries(certificates, "usercertificate", ["issuing_authority", "certificate_name"], user_id, true);
                    const {
                        data,
                        errors
                    } = await doMultiInsertQueries(queries, select_queries, "usercertificate", limitPerUser.certificates, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const certificates = JSON.parse(req.body);
                    const base_query = "UPDATE usercertificate SET certificate_name = :certificate_name, issuing_authority = :issuing_authority, ";
                    const base_values = ["certificate_name", "issuing_authority"];
                    const optional_values = ["visibility"];
                    const queries = createPutQueries(certificates, base_query, base_values, optional_values, user_id);
                    const select_queries = createGetQueries(certificates, "usercertificate", ["issuing_authority", "certificate_name"], user_id, false);
                    const {data, errors} = await doMultiPutQueries(queries, select_queries, validation);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const certificates = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM usercertificate WHERE id = ?";
                    certificates.forEach((cert) => {
                        queries.push({
                            name: cert.id,
                            query: tempQuery,
                            values: [cert.id]
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