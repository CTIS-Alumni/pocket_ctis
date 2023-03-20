import {addAndOrWhere, doquery} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session) {
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

                    if (payload.user !== "admin") {
                        query += addAndOrWhere(query, " (e.visibility = 1 OR e.user_id = ?) ");
                        values.push(payload.user_id);
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
        res.status(500).json({error: "Unauthorized"});
    }
}