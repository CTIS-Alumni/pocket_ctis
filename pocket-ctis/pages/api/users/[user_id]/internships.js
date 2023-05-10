import {
    buildSelectQueries,
    buildInsertQueries,
    buildUpdateQueries, doMultiDeleteQueries,
    insertToUserTable, updateTable, doqueryNew
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import  limitPerUser from '../../../../config/moduleConfig.js';
import {replaceWithNull} from "../../../../helpers/submissionHelpers";

const field_conditions = {
    must_be_different: ["semester"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["company_id", "department", "semester", "rating", "opinion", "visibility"],
    date: ["start_date", "end_date"]
};


const table_name = "internshiprecord";

const validation = (data) => {
    replaceWithNull(data)
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if(!data.company_id)
        return "Please select a company!";
    if(!data.department === null)
        return "Please enter department!";
    if(!data.start_date)
        return "Please enter a start date!";
    if (endDate && startDate > endDate)
        return "Start date can't be after end date!";
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return "Please do not select future dates!";
    if(data.visibility !== 0 && data.visibility !== 1)
        return "Invalid Values!";
    if(data.rating < 0 || data.rating > 5 || (data.rating % 0.5) !== 0)
        return "Invalid Values!";
    return true;
}

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload?.user === "admin" || payload?.user === "owner") {
        const internships = JSON.parse(req.body);
        const {user_id} = req.query;
        field_conditions.user.user_id = user_id;
        const method = req.method;
        switch (method) {
            case "POST":
                if(payload?.user === "admin"){
                    try {
                        const select_queries = buildSelectQueries(internships, table_name, field_conditions);
                        const queries = buildInsertQueries(internships, table_name, fields, user_id);
                        const {data, errors} = await insertToUserTable(queries, table_name,  validation, select_queries, limitPerUser.internships);
                        res.status(200).json({data, errors });

                        let completed_companies = [];
                        const company_update_query = "UPDATE company SET is_internship = 1 WHERE id = ? ";

                        for(const [index, datum] of data.entries()){
                            if(!completed_companies.includes(datum.inserted.company_id)){
                                const results = await doqueryNew({query: company_update_query, values: [datum.inserted.company_id]});
                                if(results.data)
                                    completed_companies.push(datum.inserted.company_id);
                            }
                        }

                    } catch (error) {
                        res.status(500).json({errors: {error: error.message}});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
            case "PUT":
                try{
                    if(payload?.user === "owner"){
                        fields.basic = ["rating", "opinion","visibility"];
                        fields.date = [];
                    }
                    const queries = buildUpdateQueries(internships, table_name, fields);
                    const select_queries = buildSelectQueries(internships, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                }catch(error){
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "DELETE":
                if(payload?.user === "admin") {
                    try {
                        const {data, errors} = await doMultiDeleteQueries(internships, table_name);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
        }
    }else{
        res.redirect("/401", 401);
    }
}