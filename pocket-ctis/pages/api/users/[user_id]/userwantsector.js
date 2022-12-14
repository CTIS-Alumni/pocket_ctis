import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const { user_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT uws.id, s.sector_name, uws.visibility " +
                    "FROM userwantsector uws JOIN sector s ON (uws.sector_id = s.id) " +
                    "WHERE uws.user_id = ? order by s.sector_name asc";
                const data = await doquery({query: query, values: [user_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            } catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try {
                const {sector_id,visibility} = req.body.userwantsector;
                const query = "INSERT INTO userwantsector(user_id, sector_id, visibility) values (?,?,?)";
                const data = await doquery({query: query, values: [user_id, sector_id,visibility]});
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