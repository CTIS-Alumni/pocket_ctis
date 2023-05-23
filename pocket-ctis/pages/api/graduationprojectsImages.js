import {
    buildUpdateQueries,
    buildInsertQueries,
    insertGraduationProjectWithImage,
    updateGraduationProjectWithImage
} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {replaceWithNull} from "../../helpers/submissionHelpers";
import {checkApiKey} from "./middleware/checkAPIkey";
import {parseFormForDB} from "../../helpers/imageHelper";
import {corsMiddleware} from "./middleware/cors";

const fields = {
    basic: [
        "graduation_project_name",
        "team_number",
        "product_name",
        "project_year",
        "semester",
        "project_description",
        "advisor_id",
        "team_pic",
        "poster_pic",
        "project_type",
        "company_id"],
    date: []
};

const file_map = {
    teamImage: {
        name: "temp1",
        location: '/graduationprojects/team'
    },
    posterImage: {
        name: "temp2",
        location: '/graduationprojects/poster'
    }
}

const table_name = "graduationproject";

const validation = (data) => {
    replaceWithNull(data)
    if(!data.graduation_project_name)
        return "Project Name can't be empty!";
    if(isNaN(parseInt(data.team_number)))
        return "Team Number must be a number!";
    if(!data.project_year)
        return "Project Year can't be empty!";
    if(data.project_year.length !== 9)
        return "Invalid value for Project Year!";
    if(!data.semester)
        return "Semester can't be empty!";
    if(isNaN(parseInt(data.advisor_id)))
        return "Supervisor ID must be a number!";
    if(!data.project_type)
        return "Project Type can't be empty!";
    if (data.project_type === "Company" && isNaN(parseInt(data.company_id)))
        return "Company projects must have a valid Company ID!";
    if (data.project_type !== "Company" && data.company_id !== null)
        return "Instructor or student projects can't have a Company ID!";
    return true;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
        let payload
        const method = req.method;
        switch (method) {
            case "POST":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {

                        const {obj, file_objects} = await parseFormForDB(req, fields.basic, file_map);

                        file_objects.teamImage.name = obj.project_year + "-" + obj.semester + "-" + obj.team_number;
                        if(file_objects.posterImage)
                            file_objects.posterImage.name = obj.project_year + "-" + obj.semester + "-" + obj.team_number;

                        obj.team_pic = file_objects.teamImage.name;
                        obj.poster_pic = file_objects.posterImage ? file_objects.posterImage.name : null;

                        const students = obj.students.split(",");
                        delete obj.students;
                        const queries = buildInsertQueries([obj], table_name, fields);
                        const {data, errors} = await insertGraduationProjectWithImage(queries[0], obj,students, validation, file_objects);

                        res.status(200).json({data, errors});

                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            case "PUT":
                payload = await checkUserType(session, req.query);
                if (payload?.user === "admin") {
                    try {

                        const {obj, file_objects} = await parseFormForDB(req, fields.basic, file_map);

                        file_objects.teamImage.name = obj.project_year + "-" + obj.semester + "-" + obj.team_number;
                        if(file_objects.posterImage)
                            file_objects.posterImage.name = obj.project_year + "-" + obj.semester + "-" + obj.team_number;

                        const students = obj.students.split(",");
                        delete obj.students;

                        obj.team_pic = file_objects.teamImage.name;
                        obj.poster_pic = file_objects.posterImage ? file_objects.posterImage.name : "defaultposter";

                        const oldTeamPic = obj.old_team_pic;
                        const oldPosterPic = obj.old_poster_pic || "defaultposter";

                        delete obj.old_team_pic;
                        delete obj.old_poster_pic;

                        const queries = buildUpdateQueries([obj],table_name, fields);
                        const {data, errors} = await updateGraduationProjectWithImage(queries[0], obj, students, validation, file_objects, oldTeamPic, oldPosterPic);

                        res.status(200).json({data, errors});
                    } catch (error) {
                        res.status(500).json({errors: [{error: error.message}]});
                    }
                }else res.status(403).json({errors: [{error: "Forbidden request!"}]});
                break;
            default:
                res.status(404).json({ errors: [{ error: "Invalid method" }] });
        }
    } else {
        res.redirect("/401", 401);
    }
}
export default corsMiddleware(checkApiKey(handler));