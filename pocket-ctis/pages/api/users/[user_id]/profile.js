import {doMultiQueries} from "../../../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../../../helpers/authHelper";
import {checkApiKey} from "../../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session && payload) {
        const {user_id} = req.query;
        const method = req.method;
        switch (method) {
            case "GET":
                let queries = [];
                try {
                    let temp;
                    temp = "SELECT u.id, GROUP_CONCAT(DISTINCT act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                        "u.is_retired, u.is_active FROM users u JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                        "JOIN accounttype act ON (act.id = uat.type_id) WHERE u.id = ? GROUP BY u.id";
                    queries.push({name: "basic_info", query: temp, values: [user_id]});

                    temp = "SELECT ug.id, ug.graduation_project_id, c.company_name, g.product_name, CONCAT(u.first_name,' ' ,u.last_name) as advisor, g.project_type, g.graduation_project_name, g.project_year, g.semester, g.project_description, ug.graduation_project_description, ug.visibility FROM usergraduationproject ug " +
                        "LEFT OUTER JOIN graduationproject g ON (ug.graduation_project_id = g.id) " +
                        "JOIN users u ON (u.id = g.advisor_id) " +
                        "LEFT OUTER JOIN company c ON (c.id = g.company_id) " +
                        "WHERE ug.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND ug.visibility = 1 ";
                    queries.push({name: "graduation_project", query: temp, values: [user_id]});

                    temp = "SELECT id, career_objective, visibility FROM usercareerobjective WHERE user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    queries.push({name: "career_objective", query: temp, values: [user_id]});

                    temp = "SELECT id, certificate_name, issuing_authority, visibility " +
                        "FROM usercertificate WHERE user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    temp += "ORDER BY certificate_name ASC ";
                    queries.push({name: "certificates", query: temp, values: [user_id]});

                    temp = "SELECT id, project_name, project_description, visibility FROM userproject WHERE user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    queries.push({name: "projects", query: temp, values: [user_id]});

                    temp = "SELECT  id, email_address, visibility FROM useremail WHERE user_id = ? "
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    temp += "ORDER BY email_address ASC";
                    queries.push({name: "emails", query: temp, values: [user_id]});

                    temp = "SELECT uhs.id, hs.high_school_name, uhs.high_school_id, uhs.visibility FROM userhighschool uhs JOIN highschool hs ON (uhs.high_school_id = hs.id) " +
                        "WHERE uhs.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND uhs.visibility = 1 ";
                    queries.push({name: "high_school", query: temp, values: [user_id]});

                    temp = "SELECT ul.id, ul.city_id, ci.city_name, ul.country_id, co.country_name, ul.visibility FROM userlocation ul " +
                        "LEFT OUTER JOIN city ci ON (ul.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ul.country_id = co.id) WHERE ul.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND ul.visibility = 1 ";
                    queries.push({name: "location", query: temp, values: [user_id]});

                    temp = "SELECT id, phone_number, visibility FROM userphone WHERE user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    queries.push({name: "phone_numbers", query: temp, values: [user_id]});

                    temp = "SELECT id, profile_picture, visibility FROM userprofilepicture WHERE user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND visibility = 1 ";
                    queries.push({name: "profile_picture", query: temp, values: [user_id]});

                    temp = "SELECT ue.id, ex.exam_name, ue.exam_id, ue.grade, ue.exam_date, ue.visibility FROM userexam ue JOIN exam ex ON (ue.exam_id = ex.id) " +
                        "WHERE ue.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND ue.visibility = 1 ";
                    temp += "ORDER BY ex.exam_name ASC ";
                    queries.push({name: "exams", query: temp, values: [user_id]});

                    temp = "SELECT us.id, us.skill_id, sk.skill_name, sk.skill_type_id, us.skill_level, skt.skill_type_name, us.skill_level, us.visibility " +
                        "FROM userskill us JOIN skill sk ON (us.skill_id = sk.id) " +
                        "JOIN skilltype skt ON (sk.skill_type_id = skt.id) " +
                        "WHERE us.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND us.visibility = 1 ";
                    temp += "ORDER BY sk.skill_type_id ASC ";
                    queries.push({name: "skills", query: temp, values: [user_id]});

                    temp = "SELECT usm.id, sm.social_media_name, usm.social_media_id, sm.base_link, usm.link, usm.visibility " +
                        "FROM usersocialmedia usm JOIN socialmedia sm ON (usm.social_media_id = sm.id) " +
                        "WHERE usm.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND usm.visibility = 1 ";
                    temp += "ORDER BY sm.social_media_name ASC ";
                    queries.push({name: "socials", query: temp, values: [user_id]});

                    temp = "SELECT uss.id, uss.society_id, ss.society_name, uss.activity_status, uss.visibility " +
                        "FROM userstudentsociety uss JOIN studentsociety ss ON (uss.society_id = ss.id) " +
                        "WHERE uss.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND uss.visibility = 1 ";
                    temp += "ORDER BY ss.society_name ASC";
                    queries.push({name: "societies", query: temp, values: [user_id]});

                    temp = "SELECT uws.id, uws.sector_id, s.sector_name, uws.visibility FROM userwantsector uws JOIN sector s ON (uws.sector_id = s.id) " +
                        "WHERE uws.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND uws.visibility = 1 ";
                    temp += "ORDER BY s.sector_name ASC";
                    queries.push({name: "wanted_sectors", query: temp, values: [user_id]});

                    temp = "SELECT w.id, w.company_id, c.company_name, wt.work_type_name, w.hiring_method, w.work_type_id, w.department, w.position, w.work_description, w.city_id, ci.city_name, w.country_id, co.country_name, w.start_date, w.end_date, w.visibility, w.is_current " +
                        "FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                        "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                        "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (w.country_id = co.id) " +
                        "WHERE w.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND w.visibility = 1 ";
                    temp += "ORDER BY w.start_date DESC"
                    queries.push({name: "work_records", query: temp, values: [user_id]});

                    temp = "SELECT w.company_id, c.company_name FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                        "WHERE w.user_id = ? AND w.work_type_id != 3 "
                    if(payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND w.visibility = 1 ";
                    temp += "LIMIT 2"
                    queries.push({name: "current_works", query: temp, values: [user_id]})

                    temp = "SELECT i.id, c.company_name, i.company_id, i.semester, i.department, i.start_date, i.end_date, i.rating, i.opinion, i.visibility " +
                        "FROM internshiprecord i JOIN company c ON (i.company_id = c.id) " +
                        "WHERE i.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND i.visibility = 1 ";
                    temp += "ORDER BY i.start_date DESC";
                    queries.push({name: "internships", query: temp, values: [user_id]});

                    temp = "SELECT er.id, er.edu_inst_id, ei.edu_inst_name, er.semester, er.start_date, er.end_date, er.rating, er.opinion, er.visibility, " +
                        "ci.city_name, co.country_name " +
                        "FROM erasmusrecord er JOIN educationinstitute ei ON (er.edu_inst_id = ei.id) " +
                        "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                        "WHERE er.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND er.visibility = 1 ";
                    queries.push({name: "erasmus", query: temp, values: [user_id]});

                    temp = "SELECT e.id, e.edu_inst_id, ei.edu_inst_name, e.degree_type_id, d.degree_type_name, e.education_description, e.name_of_program, e.start_date, e.end_date, e.visibility, e.is_current, " +
                        "ci.city_name, ci.id as 'city_id', co.country_name, co.id as 'country_id'  " +
                        "FROM educationrecord e " +
                        "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id)  " +
                        "JOIN degreetype d ON (e.degree_type_id = d.id)  " +
                        "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                        "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                        "WHERE e.user_id = ? ";
                    if (payload.user !== "admin" && payload.user !== "owner")
                        temp += "AND e.visibility = 1 ";
                    temp += "ORDER BY e.start_date DESC";
                    queries.push({name: "edu_records", query: temp, values: [user_id]});

                    const {data, errors} = await doMultiQueries(queries);
                    res.status(200).json({data: data, errors: errors, session: payload.user});

                } catch (error) {
                    res.status(500).json({errors: [{error:error.message}]});
                }
                break;
            case "PUT":
                if (payload?.user === "admin" || payload?.user === "owner") {
                    let put_queries = [];
                    try {
                        const {visibility} = JSON.parse(req.body);
                        let temp;
                        temp = "UPDATE usergraduationproject SET visibility = :visibility WHERE user_id = :user_id ";
                        put_queries.push({name: "graduation_project", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE usercareerobjective SET visibility = :visibility WHERE user_id = :user_id ";
                        put_queries.push({name: "career_objective", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE usercertificate SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "certificates", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userproject SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "projects", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE useremail SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "emails", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userhighschool SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "high_school", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userlocation SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "location", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userphone SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "phone_numbers", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userprofilepicture SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "profile_picture", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userexam SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "exams", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userskill SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "skills", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE usersocialmedia SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "socials", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userstudentsociety SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "societies", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE userwantsector SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "wanted_sectors", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE workrecord SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "work_records", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE internshiprecord SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "internships", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE erasmusrecord SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "erasmus", query: temp, values: [visibility, user_id]});

                        temp = "UPDATE educationrecord SET visibility = ? WHERE user_id = ? ";
                        put_queries.push({name: "edu_records", query: temp, values: [visibility, user_id]});

                        const {data, errors} = await doMultiQueries(put_queries);

                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error:error.message}]});
                    }
                } res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);
