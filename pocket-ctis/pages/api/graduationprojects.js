import {doquery} from "../../helpers/dbHelpers";
import {checkAuth} from "../../helpers/authHelper";

export default async function handler(req, res) {
    const auth_success = await checkAuth(req.headers, req.query);
    if (auth_success.user) {
        const method = req.method;
        switch (method) {
            case "GET":
                try {
                    let values = [];
                    let query = "SELECT g.id, g.graduation_project_name, g.team_number, g.project_year, g.semester, g.advisor, g.project_type, g.company_id, c.company_name " +
                        "FROM graduationproject g LEFT OUTER JOIN company c ON (g.company_id = c.id) ";

                    if (req.query.name) {
                        query += " WHERE g.graduation_project_name LIKE CONCAT('%', ?, '%') ";
                        values.push(req.query.name);
                    }

                    query += "ORDER by g.project_year";

                    const data = await doquery({query: query, values: values});
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
                    const {
                        project_name,
                        team_number,
                        product_name,
                        project_year,
                        semester,
                        project_description,
                        advisor,
                        project_type,
                        team_pic,
                        poster_pic,
                        company_id
                    } = req.body.graduationproject;
                    const query = "INSERT INTO graduationproject(project_name, team_number, product_name, project_year, " +
                        "semester, project_description, advisor, project_type, team_pic, poster_pic, company_id) values(?,?,?,?,?,?,?,?,?,?,?)";
                    const data = await doquery({
                        query: query, values: [project_name, team_number, product_name,
                            project_year, semester, project_description, advisor, project_type, team_pic, poster_pic, company_id]
                    });
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