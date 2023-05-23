import {
    buildSelectQueries, buildInsertQueries, buildUpdateQueries, doMultiDeleteQueries,
    updateTable,
    insertToUserTable, doqueryNew
} from "../../../../helpers/dbHelpers";
import modules from '../../../../config/moduleConfig.js';
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {replaceWithNull} from "../../../../helpers/submissionHelpers";
import departmentConfig from '../../../../config/departmentConfig'
import {corsMiddleware} from "../../middleware/cors";


const field_conditions = {
    must_be_different: ["edu_inst_id", "degree_type_id", "name_of_program", "start_date", "end_date", "is_current", "gpa"],
    date_fields: ["start_date", "end_date"],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: [
        "edu_inst_id",
        "degree_type_id",
        "name_of_program",
        "education_description",
        "visibility",
        "is_current",
        "gpa"
    ],
    date: ["start_date", "end_date"]
};

const table_name = "educationrecord";

const validation = (data) => {
    replaceWithNull(data)
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(!data.edu_inst_id)
        return "Please select an education institute!";
    if (startDate && endDate && startDate > endDate)
        return "Start date can't be after end date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Please do not select future dates!";
    if(!data.name_of_program)
        return "Name of Program can't be empty!";
    if(endDate && data.is_current)
        return "Can't submit an end date for ongoing education!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid values for visibility!";
    if(data.is_current !== 0 && data.is_current !== 1)
        return "Invalid values for ongoing!";
    if(data.gpa < 0 || data.gpa > 4)
        return "Invalid values for gpa!";
    return true;
}

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const edu_records = JSON.parse(req.body);
                    if(payload.user !== "admin"){
                        edu_records.forEach((rec)=>{
                            if(rec.edu_inst_id == 1 && (
                                rec.name_of_program.toLowerCase() === departmentConfig.department_name.toLowerCase() || rec.name_of_program.toLowerCase() === departmentConfig.abbreviation.toLowerCase()))
                               throw {message: "Can't add " + departmentConfig.department_name + " record!"};
                        })
                    }
                    const queries = buildInsertQueries(edu_records, table_name, fields ,user_id);
                    const select_queries = buildSelectQueries(edu_records, table_name,field_conditions);
                    const {data, errors} = await insertToUserTable(queries, table_name, validation, select_queries, modules.user_profile_data.education_records.limit_per_user);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: {error: error.message}});
                }
                break;
            case "PUT":
                try {
                    const edu_records = JSON.parse(req.body);
                    if(payload.user !== "admin"){
                        let check_to_edit_query = "SELECT id FROM educationrecord WHERE (name_of_program = ? OR name_of_program = ?) AND edu_inst_id = 1 AND user_id = ? ";
                        const res = await doqueryNew({query: check_to_edit_query, values: [departmentConfig.department_name, departmentConfig.abbreviation, user_id]});

                        let count = 0;
                        edu_records.forEach((rec, i)=>{
                            if((rec.name_of_program.toLowerCase() === departmentConfig.department_name.toLowerCase() ||
                                    rec.name_of_program.toLowerCase() === departmentConfig.abbreviation.toLowerCase()) &&
                                rec.edu_inst_id == 1)
                                count++;
                        })

                        if(count > res.data.length)
                            throw {message: "Can't add " + departmentConfig.department_name + " information! "};

                        let department_data = [], indexes = [];
                        if(!res.data)
                            throw {message: "An error occured!"}
                        if(res.data.length){
                            const ids = res.data.map(item => item.id);
                            edu_records.forEach((rec, i)=>{
                                if(ids.includes(rec.id)){
                                    department_data.push(rec)
                                    indexes.push(i);
                                }
                            })
                        }

                        if(indexes.length){
                            indexes.sort((a, b) => b - a);
                            indexes.forEach(index => edu_records.splice(index, 1));
                            const temp_fields = {
                                basic: ["gpa", "education_description"],
                                date: []
                            }
                            const q = buildUpdateQueries(department_data, table_name, temp_fields);
                            const results = await updateTable(q,validation);
                            if(!results.data || results.errors.length){
                                throw {message: "An error occured!"};
                            }
                        }

                    }
                    const queries = buildUpdateQueries(edu_records, table_name, fields);
                    const select_queries = buildSelectQueries(edu_records, table_name,field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({errors:[{error:error.message}]});
                }
                break;
            case "DELETE":
                try {
                    const edu_records = JSON.parse(req.body);
                    if(payload.user !== "admin"){
                        let check_to_delete_query = "SELECT id FROM educationrecord WHERE (name_of_program = ? OR name_of_program = ?) AND edu_inst_id = 1 AND user_id = ? ";
                        const res = await doqueryNew({query: check_to_delete_query, values: [departmentConfig.department_name, departmentConfig.abbreviation, user_id]});
                        console.log("heres res", res);
                        if(!res.data)
                            throw {message: "An error occured!"}
                        if(res.data.length){
                            edu_records.forEach((rec)=>{
                                if(rec?.id === res.data[0].id)
                                    throw {message: "Can't delete " + departmentConfig.department_name + " record!"}
                            })
                        }
                    }
                    const {data, errors} = await doMultiDeleteQueries(edu_records, table_name);
                    res.status(200).json({data, errors});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
}
export default corsMiddleware(handler);