import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method) {
        case "GET":
            try {
                const query = "SELECT er.id, ei.inst_name, er.semester, er.start_date, er.end_date, er.rating, er.opinion, er.visibility " +
                    "FROM erasmusrecord er JOIN educationinstitute ei ON (er.edu_inst_id = ei.id) " +
                    "WHERE er.user_id = ?";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch (error) {
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {edu_inst_id, semester ,start_date, end_date} = req.body.erasmus;
                const query = "INSERT INTO erasmusrecord(user_id, edu_inst_id,semester, start_date, end_date) values (?,?,?,?,?)";
                const data = await doquery({query: query, values: [user_id,edu_inst_id,semester,start_date, end_date]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }

    }
}