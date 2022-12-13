import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const high_school_query = "SELECT uhs.id, hs.high_school_name, uhs.visibility FROM userhighschool uhs JOIN highschool hs ON (uhs.high_school_id = hs.id) " +
                    "WHERE uhs.user_id = ?";
                const high_school_info = await doquery({query: high_school_query, values: [user_id]});
                res.status(200).json({high_school_info});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {high_school_id, visibility} = req.body.highschool;
                const post_high_school_query = "INSERT INTO userhighschool(user_id, high_school_id, visibility) values (?, ?, ?)";
                const data = await doquery({query: post_high_school_query, values: [user_id, high_school_id, visibility]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {high_school_id, visibility} = req.body.highschool;
                const put_high_school_query = "UPDATE userhighschool SET high_school_id = ?, visibility = ? WHERE user_id = ?";
                const data = await doquery({query: put_high_school_query,values: [high_school_id, visibility, user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_high_school_query = "DELETE FROM userhighschool WHERE user_id = ?"
                const data = await doquery({query: delete_high_school_query,values: [user_id]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }break;
    }
}