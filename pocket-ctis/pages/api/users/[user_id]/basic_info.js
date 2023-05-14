import {buildUpdateQueries, doquery, doqueryNew, updateTable} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import {checkApiKey} from "../../middleware/checkAPIkey";

const fields = {
    basic: ["first_name", "last_name", "is_retired", "is_active", "gender", "nee"],
    date: []
}

const table_name = "users"

const validation = (data) =>{
    replaceWithNull(data);
    if(!data.first_name || !data.last_name )
        return "First name and last name can't be empty!"
    if(data.is_active !== 1 && data.is_active !== 0)
        return "Invalid Values!";
    if(data.is_retired !== 1 && data.is_retired !== 0)
        return "Invalid Values!";
    if(data.gender !== 1 && data.gender !== 0)
        return "Invalid Values!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (payload?.user === "admin" || payload?.user === "owner") {
        const basic_info = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT u.id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                        "u.is_retired, u.graduation_project_id, g.project_name, g.project_year, g.project_description, u.is_active FROM users u " +
                        "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "LEFT OUTER JOIN graduationproject g ON (u.graduation_project_id = g.id) " +
                        "WHERE u.id = ? GROUP BY u.id";

                    const {data, errors} = await doqueryNew({query: query, values: [user_id]});
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                try {
                    if(payload?.user === "owner"){
                        fields.basic = ["is_retired"];
                    }
                    const queries = buildUpdateQueries(basic_info, table_name, fields);
                    const {data, errors} = await updateTable(queries, validation);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);