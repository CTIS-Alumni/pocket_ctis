import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const {sector_id} = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const company_query = "SELECT id, company_name, is_internship FROM company WHERE sector_id = ?";
                const companies = await doquery({query: company_query, values: [sector_id]});
                res.status(200).json({companies});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}