import {
    addAndOrWhere,
    buildUpdateQueries, createUser, createUsersWithCSV, doMultiDeleteQueries, doqueryNew,
    updateTable,
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";

const table_name = "users";

const validation = (data) => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    replaceWithNull(data);
    if (!data.bilkent_id)
        return "Bilkent ID can't be empty!";
    if (!data.first_name || !data.last_name)
        return "First Name and Last Name can't be empty!";
    if (parseInt(data.gender) !== 1 && parseInt(data.gender) !== 0)
        return "Invalid value for gender!";
    if (data.hasOwnProperty("is_active") && data.is_active !== 1 && data.is_active !== 0)
        return "Invalid value for activity status!";
    if (!email_regex.test(data.contact_email))
        return "Invalid Contact Email!";

    if(!data.types?.length)
        return "User must have account type!";

    for (const type of data.types) {
        if (isNaN(parseInt(type)))
            return "User types must be a valid integer!";
    }
    return true;
}

const CSVvalidation = (data) => {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    replaceWithNull(data);
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (!data.bilkent_id)
        return "Bilkent ID can't be empty!";
    if (!data.first_name || !data.last_name)
        return "First Name and Last Name can't be empty!";
    if (parseInt(data.gender) !== 1 && parseInt(data.gender) !== 0)
        return "Invalid value for gender!";
    if (data.hasOwnProperty("is_active") && data.is_active !== 1 && data.is_active !== 0)
        return "Invalid value for activity status!";
    if (!email_regex.test(data.contact_email))
        return "Invalid Contact Email!";

    if(!data.types?.length)
        return "User must have account type!";

    for (const type of data.types) {
        if(type == 4)
            return "Can not create admin account with CSV."
        if (isNaN(parseInt(type)))
            return "User types must be a valid integer!";
    }

    if(!data.edu_inst_id && (data.degree_type_id || data.name_of_program || data.start_date || data.end_date || data.is_current))
        return "Missing fields in education record!"
    if(data.edu_inst_id && isNaN(parseInt(data.edu_inst_id)))
        return "Education Institute ID must be a valid number!";
    if(data.edu_inst_id && !data.degree_type_id)
        return "Degree Type ID can't be empty!";
    if(data.edu_inst_id && !data.name_of_program)
        return "Name of Program can't be empty!";
    if(data.edu_inst_id && !startDate)
        return "Please enter a Start Date!";
    if (endDate && startDate > endDate)
        return "Start date can't be after end date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Please do not select future dates!";
    if (data.edu_inst_id &&  parseInt(data.is_current) !== 1 && parseInt(data.is_current) !== 0)
        return "Invalid value for current status!";


    return true;
}

const fields = {
    basic: ["first_name, last_name, is_retired, is_active, gender, contact_email, bilkent_id"],
    date: []
}

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
        const method = req.method;
        switch (method) {
            case "GET":
                if(req.query.advisors){
                    try{
                        const query = "SELECT u.id, u.first_name, u.last_name FROM users u JOIN graduationproject g ON g.advisor_id = u.id WHERE u.id = g.advisor_id GROUP BY u.id";
                        const {data, errors} = await doqueryNew({query: query, values: []});
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else{
                    try{
                        let values = [];
                        let query = "SELECT GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', u.id, upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name" +
                            " FROM users u JOIN userprofilepicture upp ON (upp.user_id = u.id) " +
                            "JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                            "JOIN accounttype act ON (act.id = uat.type_id) ";

                        if (req.query.highschool_id) {
                            query += "LEFT OUTER JOIN userhighschool uhs ON (uhs.user_id = u.id) WHERE ";
                            if (payload.user !== "admin") {
                                query += " uhs.high_school_id = ? AND (uhs.visibility = 1 OR uhs.user_id = ?)";
                                values.push(req.query.highschool_id, payload.user_id);
                            } else {
                                query += " uhs.high_school_id = ? ";
                                values.push(req.query.highschool_id);
                            }
                        }

                        if (req.query.wantsector_id) { //for a specific sectors page
                            query += "LEFT OUTER JOIN userwantsector uws ON (uws.user_id = u.id) WHERE ";
                            if (payload.user !== "admin") {
                                query += " uws.sector_id = ? AND (uws.visibility = 1 OR uws.user_id = ?) ";
                                values.push(req.query.wantsector_id, payload.user_id);
                            } else {
                                query += " uws.sector_id = ? ";
                                values.push(req.query.wantsector_id);
                            }
                        }

                        if (req.query.society_id) {
                            query += "LEFT OUTER JOIN userstudentsociety uss ON (uss.user_id = u.id) WHERE ";
                            if (payload.user !== "admin") {
                                query += " uss.society_id = ? AND (uss.visibility = 1 OR uss.user_id = ?) ";
                                values.push(req.query.society_id, payload.user_id);
                            } else {
                                query += " uss.society_id = ? ";
                                values.push(req.query.society_id);
                            }

                        }

                        if (req.query.project_id) {
                            query += " LEFT OUTER JOIN usergraduationproject ugp ON (ugp.user_id = u.id) WHERE ugp.graduation_project_id = ? ";
                            values.push(req.query.project_id);
                        }

                        if (req.query.name) { //for general search
                            query += addAndOrWhere(query, " CONCAT(u.first_name, ' ', u.nee, ' ', u.last_name) LIKE CONCAT('%',?,'%') ");
                            values.push(req.query.name);
                        }

                        query += " GROUP BY uat.user_id ORDER BY u.first_name ASC";

                        const {data, errors} = await doqueryNew({query: query, values: values});
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }
                break;
            case "POST":
                if (payload?.user === "admin") {
                    try {
                        const {users} = JSON.parse(req.body);
                        if(req.query.csv){
                            const {data, errors} = await createUsersWithCSV(users, CSVvalidation);
                            res.status(200).json({data, errors});
                        }else {
                            const {data, errors} = await createUser(users[0], validation);
                            res.status(200).json({data, errors});
                        }

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(500).json({error: "Unauthorized!"});
                break;
            case "PUT":
                if (payload?.user === "admin") {
                    try{
                        const users = JSON.parse(req.body);
                        const queries = buildUpdateQueries(users, table_name, fields);
                        const {data, errors} = await updateTable(queries, validation);
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else res.status(403).json({errors: [{error: "Forbidden action!"}]});
                break;
            case "DELETE":
                if(payload?.user === "admin"){
                    try{
                        const users = JSON.parse(req.body);
                        const {data, errors} = await doMultiDeleteQueries(users, table_name); //TODO: learn what to do after users are deleted
                        res.status(200).json({data, errors});
                    }catch(error){
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden action!"}]});
        }
    } else {
        res.redirect("/401", 401);
    }
}