import {
    addAndOrWhere,
    insertToUserRelatedTable,
    buildInsertQueries, buildSelectQueries, buildSearchQuery, doMultiQueries, doqueryNew, doMultiDeleteQueries
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import limitPerUser from "../../config/moduleConfig";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";

const fields = {
    basic: ["company_id", "department", "semester"],
    date: ["start_date", "end_date"]
};

const table_name = "request";

const validation = (data) => {
    replaceWithNull(data);
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(isNaN(parseInt(data.user_id)))
        return "User ID must be a number!";
    if(isNaN(parseInt(data.company_id)))
        return "Company ID must be a number!";
    if(!data.semester)
        return "Semester can't be empty!";
    if(!data.department)
        return "Department can't be empty!";
    if(!startDate)
        return "Please enter a start date!";
    if (endDate && startDate > endDate)
        return "Start Date can't be after End Date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Dates can't be after current date!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":

                break;
            case "PUT":

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
export default checkApiKey(handler);