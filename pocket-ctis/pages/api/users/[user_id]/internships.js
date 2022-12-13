import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const internship_query = "SELECT i.id, c.company_name, i.semester, i.department, i.start_date, i.end_date, i.rating, i.opinion, i.visibility " +
                    "FROM internshiprecord i JOIN company c ON (i.company_id = c.id) " +
                    "WHERE i.user_id = ? order by i.start_date desc";

                const internship_info = await doquery({query: internship_query, values: [user_id]});
                res.status(200).json({internship_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_id, semester, department, start_date, end_date} = req.body.internship;
                const post_internship_query = "INSERT INTO internshiprecord(user_id, company_id, semester, department, start_date, end_date) values (?,?,?,?,?,?)";
                const data = await doquery({query: post_internship_query, values: [user_id,company_id, semester, department, start_date, end_date]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}