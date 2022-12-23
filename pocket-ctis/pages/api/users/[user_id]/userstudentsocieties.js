import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT uss.id, ss.society_name, uss.activity_status, uss.visibility " +
                    "FROM userstudentsociety uss JOIN studentsociety ss ON (uss.society_id = ss.id) " +
                    "WHERE uss.user_id = ? order by ss.society_name asc";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {sector_id,visibility} = req.body.userwantsector;
                const query = "INSERT INTO userwantsector(user_id,sector_id, visibility) values (?,?,?,?)";
                const data = await doquery({query: query, values: [user_id,sector_id,visibility]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}