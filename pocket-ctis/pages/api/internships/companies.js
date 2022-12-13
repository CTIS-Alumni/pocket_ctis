import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const company_query = "SELECT c.id, c.company_name, c.sector_id, s.sector_name, c.rating " +
                    "FROM company c JOIN sector s ON (c.sector_id = s.id) " +
                    "WHERE c.is_internship = true order by company_name asc";
                //use c.id and c.sector_id as links to their pages
                const companies = await doquery({query: company_query});
                res.status(200).json({companies});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}