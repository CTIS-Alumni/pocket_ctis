import {doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let id_params = "";
                    let query = "SELECT s.id, s.skill_name, s.skill_type_id, st.skill_type_name from skill s LEFT OUTER JOIN skilltype st ON (s.skill_type_id = st.id)";

                    if (req.query.type_id) {
                        query += "WHERE skill_type_id = ? ";
                        id_params = req.query.type_id;
                    }
                    query += "ORDER BY skill_name ASC";

                    const data = await doquery({query: query, values: [id_params]});
                    if (data.hasOwnProperty("error"))
                        res.status(500).json({error: data.error.message});
                    else
                        res.status(200).json({data});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "POST":
                try {
                    const {skill_name, skill_type_id} = req.body.skill;
                    const query = "INSERT INTO skill(skill_name, skill_type_id) values (?, ?)"
                    const data = await doquery({query: query, values: [skill_name, skill_type_id]});
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