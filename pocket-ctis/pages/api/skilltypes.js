import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM skilltype order by type_name asc"; //for dropboxes
                const data = await doquery({query: query});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {type_name} = req.body.skilltype;
                const post_skilltype_query = "INSERT INTO skilltype(type_name) values (?)"
                const data = await doquery({query: post_skilltype_query, values: [type_name]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}