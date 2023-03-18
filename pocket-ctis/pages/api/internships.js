import {addCondition, doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const session = auth_success.user
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [];
                    let query = "SELECT i.id, i.user_id, GROUP_CONCAT(act.type_name) as 'user_types', upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, " +
                        "i.company_id, i.department, c.company_name, i.semester, i.start_date, i.end_date, i.rating, i.opinion, i.visibility as 'record_visibility' " +
                        "FROM internshiprecord i JOIN users u on (i.user_id = u.id) " +
                        "JOIN userprofilepicture upp ON (i.user_id = upp.user_id) " +
                        "JOIN useraccounttype uat ON (uat.user_id = i.user_id)  " +
                        "JOIN accounttype act ON (act.id = uat.type_id) " +
                        "JOIN company c ON (i.company_id = c.id) ";

                    if(session !== "admin"){
                        query += addCondition(query, " (i.visibility = 1 OR i.user_id = ?)");
                        values.push(auth_success.user_id);
                    }

                    query += "GROUP BY i.id ORDER BY i.record_date DESC";

                    const data = await doquery({query: query, values});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    } else {
        res.status(500).json({error: auth_success.error});
    }
}