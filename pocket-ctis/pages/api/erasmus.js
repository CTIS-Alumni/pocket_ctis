import {addCondition, doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res){
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const session = auth_success.user
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [];
                    let query = "SELECT e.id, e.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                        "e.edu_inst_id, ei.edu_inst_name, e.semester, e.start_date, e.end_date, e.rating, e.opinion, e.visibility as 'record_visibility' " +
                        "FROM erasmusrecord e JOIN users u on (e.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (e.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = e.user_id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id) " ;

                    if (session !== "admin") {
                        query += addCondition(query, " (e.visibility = 1 OR e.user_id = ?) ");
                        values.push(auth_success.user_id);
                    }

                    query += "GROUP BY e.id ORDER BY e.end_date DESC ";

                    const data = await doquery({query: query, values: values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else {
        res.status(500).json({error: auth_success.error});
    }
}