import {doquery} from "../../../../helpers/dbHelpers";

export default async function handler(req, res){
    const api_key = req.headers['x-api-key'];
    if(api_key === undefined || api_key !== process.env.API_KEY){
        res.status(401).json({message: "Unauthorized user!"});
    }
    const { country_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "select id, city_name from city where country_id = ? order by city_name asc";

                const data = await doquery({query: query,values: [country_id]});
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