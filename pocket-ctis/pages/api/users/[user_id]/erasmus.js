import {
    buildSelectQueries,
    buildInsertQueries,
    buildUpdateQueries,
    doMultiDeleteQueries,
    updateTable,
    insertToUser
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import  limitPerUser from '../../../../config/moduleConfig.js';

const field_conditions = {
    must_be_different: ["edu_inst_id", "semester"],
    date_fields: [],
    user: {
        check_user_only: true,
        user_id: null
    }
}

const fields = {
    basic: ["edu_inst_id", "semester", "rating", "opinion", "visibility"],
    date: ["start_date", "end_date"]
};


const table_name = "erasmusrecord";

const validation = (data) => {
    const currentDate = new Date();
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (startDate && endDate && startDate > endDate)
        return false;
    if((endDate && endDate > currentDate) || (startDate && startDate > currentDate))
        return false;
    if(data.visibility !== 0 && data.visibility !== 1)
        return false;
    if(data.opinion !== null && data.opinion.trim() === "")
        return false;
    if(data.rating < 0 || data.rating > 10 || (data.rating % 0.5) !== 0)
        return false;
    return true;
}
export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const erasmus = JSON.parse(req.body);
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                if(payload.user === "admin"){
                    try {
                        const select_queries = buildSelectQueries(erasmus, table_name,field_conditions);
                        const queries = buildInsertQueries(erasmus, table_name, fields, user_id);
                        const {data, errors} = await insertToUser(queries, table_name, validation, select_queries, limitPerUser.erasmus);
                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({error: error.message});
                    }
                }else{
                    res.status(500).json({error:"Unauthorized"});
                }
                break;
            case "PUT":
                try{
                    if(payload.user === "owner"){
                        fields.basic = ["rating", "opinion","visibility"];
                        fields.date = [];
                        field_conditions.must_be_different = [];
                    }
                    const queries = buildUpdateQueries(erasmus, table_name, fields);
                    const select_queries = buildSelectQueries(erasmus, table_name, field_conditions);
                    const {data, errors} = await updateTable(queries, validation, select_queries);
                    res.status(200).json({data, errors});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try{
                    const {data, errors} = await doMultiDeleteQueries(erasmus, table_name);
                    res.status(200).json({data, errors});
                }catch(error){
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}