import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const get_degrees_query = "SELECT * FROM degreetype order by degree_name asc";  //for dropboxes
                const data = await doquery({query: get_degrees_query});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {degree_name} = req.body;
                const post_degree_query = "INSERT INTO degreetype(degree_name) values (?)";
                const data = await doquery({query: post_degree_query, values: [degree_name]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}