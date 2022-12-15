import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM sector order by sector_name asc";
                const data = await doquery({query: query});
                send(data);
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