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
                const query = "SELECT * FROM socialmedia order by social_media_name asc";

                const data = await doquery({query: query});
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