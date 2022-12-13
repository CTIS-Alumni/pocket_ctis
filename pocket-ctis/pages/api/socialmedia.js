import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    try{
        const query = "SELECT * FROM socialmedia order by social_media_name asc";

        const data = await doquery({query: query});
        res.status(200).json({data});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}