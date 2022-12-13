import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    try{
        const query = "SELECT * FROM country order by country_name asc";

        //for dropboxes

        const data = await doquery({query: query});
        res.status(200).json({data});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}