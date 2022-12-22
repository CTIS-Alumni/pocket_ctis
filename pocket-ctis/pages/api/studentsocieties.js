import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const api_key = req.query.key;
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM studentsociety order by society_name asc";

                const data = await doquery({query:query});
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
                const {society_name, description} = req.body.society;
                const query = "INSERT INTO studentsociety(society_name, description) values(?, ?)";
                const data = await doquery({query: query, values: [society_name, description]});
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