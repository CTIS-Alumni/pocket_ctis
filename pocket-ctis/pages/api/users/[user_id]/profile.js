import {doMultiQueries, doquery} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            let queries = [];
            try{
                let temp;
                temp = "SELECT u.id, GROUP_CONCAT(act.type_name) as 'user_types', u.first_name, u.nee, u.last_name, u.gender," +
                    "u.is_retired, u.is_active FROM users u JOIN useraccounttype uat ON (uat.user_id = u.id) " +
                    "JOIN accounttype act ON (act.id = uat.type_id) WHERE u.id = ? GROUP BY u.id";
                queries.push({name: "basic_info", query: temp, values: [user_id]});

                temp = "SELECT u.graduation_project_id, g.project_name, g.project_year, g.project_description FROM users u " +
                    "LEFT OUTER JOIN graduationproject g ON (u.graduation_project_id = g.id) WHERE u.id = ?";
                queries.push({name: "graduation_project", query: temp, values: [user_id]});

                temp = "SELECT id, career_objective, visibility FROM usercareerobjective WHERE user_id = ?";
                queries.push({name: "career_objective", query: temp, values: [user_id]});

                temp = "SELECT id, certificate_name, issuing_authority, visibility " +
                    "FROM usercertificate WHERE user_id = ? order by certificate_name asc";
                queries.push({name: "certificates", query: temp, values: [user_id]});

                temp = "SELECT  id, email_address, visibility FROM useremail WHERE user_id = ? order by email_address asc";
                queries.push({name: "emails", query: temp, values: [user_id]});

                temp = "SELECT uhs.id, hs.high_school_name, uhs.high_school_id, uhs.visibility FROM userhighschool uhs JOIN highschool hs ON (uhs.high_school_id = hs.id) " +
                    "WHERE uhs.user_id = ?";
                queries.push({name: "high_school", query: temp, values: [user_id]});

                temp = "SELECT ul.id, ul.city_id, ci.city_name, ul.country_id, co.country_name, ul.visibility FROM userlocation ul " +
                    "LEFT OUTER JOIN city ci ON (ul.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ul.country_id = co.id) WHERE ul.user_id = ?";
                queries.push({name: "location", query: temp, values: [user_id]});

                temp = "SELECT id, phone_number, visibility FROM userphone WHERE user_id = ?";
                queries.push({name: "phone_numbers", query: temp, values: [user_id]});

                temp = "SELECT id, profile_picture, visibility FROM userprofilepicture WHERE user_id = ?";
                queries.push({name: "profile_picture", query: temp, values: [user_id]});

                temp = "SELECT ue.id, ex.exam_name, ue.exam_id, ue.grade, ue.visibility FROM userexam ue JOIN exam ex ON (ue.exam_id = ex.id) " +
                    "WHERE ue.user_id = ? order by ex.exam_name asc";
                queries.push({name: "exams", query: temp, values: [user_id]});

                temp = "SELECT us.id, us.skill_id, sk.skill_name, sk.skill_type_id, us.skill_level, skt.type_name, us.skill_level, us.visibility " +
                    "FROM userskill us JOIN skill sk ON (us.skill_id = sk.id) " +
                    "JOIN skilltype skt ON (sk.skill_type_id = skt.id) " +
                    "WHERE us.user_id = ? order by sk.skill_type_id asc ";
                queries.push({name: "skills", query: temp, values: [user_id]});

                temp = "SELECT usm.id, sm.social_media_name, usm.social_media_id, usm.link, usm.visibility " +
                    "FROM usersocialmedia usm JOIN socialmedia sm ON (usm.social_media_id = sm.id) " +
                    "WHERE usm.user_id = ? order by sm.social_media_name asc ";
                queries.push({name: "socials", query: temp, values: [user_id]});

                temp = "SELECT uss.id, uss.society_id, ss.society_name, uss.activity_status, uss.visibility " +
                    "FROM userstudentsociety uss JOIN studentsociety ss ON (uss.society_id = ss.id) " +
                    "WHERE uss.user_id = ? order by ss.society_name asc";
                queries.push({name: "societies", query: temp, values: [user_id]});

                temp = "SELECT uws.id, uws.sector_id, s.sector_name, uws.visibility FROM userwantsector uws JOIN sector s ON (uws.sector_id = s.id) " +
                    "WHERE uws.user_id = ? order by s.sector_name asc";
                queries.push({name: "wanted_sectors", query: temp, values: [user_id]});

                temp = "SELECT w.id, w.company_id, c.company_name, wt.type_name as 'work_type_name', w.work_type_id, w.department, w.position, w.work_description, w.city_id, ci.city_name, w.country_id, co.country_name, w.start_date, w.end_date, w.visibility, w.is_current " +
                    "FROM workrecord w LEFT OUTER JOIN company c ON (w.company_id = c.id) " +
                    "JOIN worktype wt ON (w.work_type_id = wt.id) " +
                    "LEFT OUTER JOIN city ci ON (w.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (w.country_id = co.id) " +
                    "WHERE w.user_id = ? order by w.start_date desc";
                queries.push({name: "work_records", query: temp, values: [user_id]});

                temp = "SELECT i.id, c.company_name, i.company_id, i.semester, i.department, i.start_date, i.end_date, i.rating, i.opinion, i.visibility " +
                    "FROM internshiprecord i JOIN company c ON (i.company_id = c.id) " +
                    "WHERE i.user_id = ? order by i.start_date desc";
                queries.push({name: "internships", query: temp, values: [user_id]});

                temp = "SELECT er.id, er.edu_inst_id, ei.inst_name, er.semester, er.start_date, er.end_date, er.rating, er.opinion, er.visibility, " +
                    "ci.city_name, co.country_name "+
                    "FROM erasmusrecord er JOIN educationinstitute ei ON (er.edu_inst_id = ei.id) "+
                    "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) "+
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) "+
                    "WHERE er.user_id = ?";
                queries.push({name: "erasmus", query: temp, values: [user_id]});

                temp = "SELECT e.id, e.edu_inst_id, ei.inst_name as 'edu_inst_name', d.id as 'degree_type_id', d.degree_name as 'degree_type_name', e.name_of_program, e.start_date, e.end_date, e.visibility, e.is_current, " +
                    "ci.city_name, ci.id as 'city_id', co.country_name, co.id as 'country_id'  " +
                    "FROM educationrecord e " +
                    "JOIN educationinstitute ei ON (e.edu_inst_id = ei.id)  " +
                    "JOIN degreetype d ON (e.degree_type_id = d.id)  " +
                    "LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE e.user_id = ? order by e.start_date desc ";
                queries.push({name: "edu_records", query: temp, values: [user_id]});


                const {data, errors} = await doMultiQueries(queries);
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {is_retired, is_active, graduation_project_id,nee} = req.body.user;
                const query = "UPDATE users SET is_retired = ?, is_active = ?, graduation_project_id = ?, nee = ?  WHERE id = ?";
                const data = await doquery({query: query,values: [is_retired, is_active, graduation_project_id,nee, user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM users WHERE id = ?"
                const data = await doquery({query: query,values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}