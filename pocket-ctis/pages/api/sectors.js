import {doquery} from "../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method){
        case "GET":
            try{
                let values = [];
                let query = "SELECT s.id, s.sector_name "

                if(req.query.company)
                    query += ", COUNT (DISTINCT c.id) as company_count "

                if(req.query.wanting)
                    query += ", COUNT (DISTINCT uws.user_id) as wanting_count "

                if(req.query.working)
                    query += ", COUNT (DISTINCT w.user_id) as working_count "

                query += "FROM sector s "

                if(req.query.company)
                    query +="LEFT OUTER JOIN company c ON (s.id = c.sector_id) "

                if(req.query.wanting)
                    query += "LEFT OUTER JOIN userwantsector uws ON (s.id = uws.sector_id) "

                if(req.query.working)
                    query += "LEFT OUTER JOIN workrecord w ON (c.id = w.company_id) "

                if(req.query.name){ // for general search
                    query += "WHERE sector_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                }

                query += "GROUP BY s.id, s.sector_name order by sector_name asc ";
                const sectors = await doquery({query: query, values: values});
                if(sectors.hasOwnProperty("error"))
                    res.status(500).json({error: sectors.error.message});
                else
                    res.status(200).json({sectors});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {sector_name} = req.body.sector;
                const query = "INSERT INTO sector(sector_name) values(?)";
                const data = await doquery({query: query, values: [sector_name]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}