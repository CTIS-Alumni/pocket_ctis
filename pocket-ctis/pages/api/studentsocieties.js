import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM studentsociety order by society_name asc";

                const data = await doquery({query:query});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {society_name, description} = req.body.society;
                const post_society_query = "INSERT INTO studentsociety(society_name, description) values(?, ?)";
                const data = await doquery({query: post_society_query, values: [society_name, description]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}