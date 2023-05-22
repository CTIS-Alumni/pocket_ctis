import {
    buildSearchQuery,
    doMultiDeleteQueries, doMultiQueries, doqueryNew
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import {sendResolvedRequestMail} from "../../helpers/mailHelper";
import {corsMiddleware} from "./middleware/cors";

const columns = {
    user: "CONCAT(u.first_name, ' ', u.last_name) LIKE CONCAT('%', ?, '%') OR CONCAT(u.first_name, ' ', u.nee ,' ', u.last_name)",
    subject: "r.subject",
    description: "r.description",
    id: "r.id",
    user_id: "r.user_id",
    request_date: "r.request_date",
    type: "r.type",
    is_closed: "r.is_closed"
}

const table_name = "request";

const validation = (data) => {
    replaceWithNull(data);

    if(isNaN(parseInt(data.user_id)))
        return "User ID must be a number!";
    if(!data.type)
        return "Request type can't be empty!";
    if(!data.description)
        return "Request description can't be empty!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [], length_values = [];
                    let query = "SELECT r.id, r.user_id, u.first_name, u.bilkent_id, u.contact_email, u.last_name, r.type, r.description, r.request_date, r.is_closed FROM request r " +
                        "LEFT OUTER JOIN users u ON (u.id = r.user_id) "
                    let length_query = "SELECT COUNT(*) as count FROM request ";


                    ({query, length_query} = await buildSearchQuery(req, query, values,  length_query, length_values, columns));

                    const {data, errors} =  await doMultiQueries([{name: "data", query: query, values: values},
                        {name: "length", query: length_query, values: length_values}]);

                    res.status(200).json({data:data.data, length: data.length[0].count, errors: errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;

            case "POST":
                if(session.payload.mode === "user") {
                    try {
                        const {request} = JSON.parse(req.body);
                        request.user_id = payload.user_id;
                        const is_valid = validation(request);
                        if(is_valid !== true)
                            throw {message: is_valid};

                        const query = "INSERT INTO request (user_id, subject, type, description) values (?,?,?,?) ";
                        const {data, errors} = await doqueryNew({query: query, values: [payload.user_id, request.subject, request.type, request.description]});
                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;

                break;
            case "PUT":
                if(session.payload.mode === "admin") {
                    try {
                        if(req.query.close){
                            const {request} = JSON.parse(req.body);
                            console.log("here is request", request);
                            const query = "UPDATE request SET is_closed = ? WHERE id = ? ";
                            const {data, errors} = await doqueryNew({query: query, values: [request.is_closed, request.id]});

                            if(errors)
                                throw {message: errors[0].error}

                            const mail_status = await sendResolvedRequestMail(request);
                            res.status(200).json({data: mail_status, errors: errors});
                        }
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case 'DELETE':
                try {
                    const requests = JSON.parse(req.body);
                    const {data, errors} = await doMultiDeleteQueries(requests, table_name);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));