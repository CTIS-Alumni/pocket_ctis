import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    const { company_id } = req.query;
    switch(method){
        case "GET":
            try{
                const get_company_query = "SElECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship FROM company c JOIN sector s on (c.sector_id = s.id) WHERE c.id = ?";
                //use sector_id as link to that sector
                const company_info = await doquery({query: get_company_query,values: [company_id]});
                res.status(200).json({company_info});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {company_name, sector_id, is_internship} = req.body.company;
                const put_company_query = "UPDATE company SET company_name = ?, sector_id = ?, is_internship = ? WHERE id = ?"
                const data = await doquery({query: put_company_query,values: [company_name, sector_id, is_internship, company_id]});
                res.status(200).json({message: data });
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const delete_company_query = "DELETE FROM company WHERE id = ?"
                const data = await doquery({query: delete_company_query,values: [company_id]});
                res.status(200).json({message: data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}