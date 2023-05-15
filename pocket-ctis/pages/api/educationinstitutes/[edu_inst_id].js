import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../helpers/authHelper";

export default async function handler(req, res) {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload;
        const {edu_inst_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    const query = "SELECT ei.id, ei.edu_inst_name, ci.city_name, co.country_name, ei.is_erasmus, ei.rating " +
                        "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON(ci.country_id = co.id) WHERE ei.id = ?"

                    const {data, errors} = await doqueryNew({query: query, values: [edu_inst_id]});
                    res.status(200).json({data: data[0] || null, errors});
                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const {inst_name, city_id, is_erasmus} = req.body.educationinstitute;
                        const query = "UPDATE educationinstitute SET edu_inst_name = ?, city_id = ?, is_erasmus = ? WHERE id = ?"
                        const data = await doquery({
                            query: query,
                            values: [inst_name, city_id, is_erasmus, edu_inst_id]
                        });
                        if (data.hasOwnProperty("error"))
                            res.status(500).json({error: data.error.message});
                        else
                            res.status(200).json({data});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                } else {
                    res.redirect("/401", 401);
                }
                break;
            case "DELETE":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {
                        const query = "DELETE FROM educationinstitute WHERE id = ?"
                        const data = await doquery({query: query, values: [edu_inst_id]});
                        res.status(200).json({message: data});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else{
                    res.redirect("/401", 401);
                }
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}