import {
    InsertToUser,
    doMultiQueries,
    doquery
} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";

export default async function handler(req, res){
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if(payload.user === "admin" || payload.user === "owner") {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const sectors = JSON.parse(req.body);
                    const base_query = "INSERT INTO userwantsector( ";
                    const fields = ["sector_id", "visibility"];
                    const queries = buildInsertQueries(sectors, fields, base_query, user_id);
                    const {data, errors} = await insertToUser(queries, "userwantsector");
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "PUT":
                try {
                    const sectors = JSON.parse(req.body);
                    const base_query = "UPDATE userwantsector SET sector_id = ?, ";
                    const base_values = ["sector_id"];
                    const optional_values = ["visibility"];
                    const queries = (sectors, base_query, base_values, optional_values);
                    const {data, errors} = await doMultiQueries(queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
            case "DELETE":
                try {
                    const sectors = JSON.parse(req.body);
                    let queries = [];
                    const tempQuery = "DELETE FROM userwantsector WHERE id = ?";
                    sectors.forEach((s) => {
                        queries.push({
                            name: s.id,
                            query: tempQuery,
                            values: [s.id]
                        });
                    });
                    const {data, errors} = await doMultiQueries(queries);
                    res.status(200).json({data, errors});
                } catch (error) {
                    res.status(500).json({error: error.message});
                }
                break;
        }
    }else{
        res.status(500).json({errors: "Unauthorized"});
    }
}