import {doquery} from "../../helpers/dbconnect";

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
                let query = "SELECT * FROM sector ";

                if(req.query.name){ // for general search
                    query += "WHERE sector_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                }

                query += "order by sector_name asc ";
                const data = await doquery({query: query, values: values});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
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