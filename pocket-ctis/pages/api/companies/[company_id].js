import {doquery} from "../../../helpers/dbHelpers";

export default async function handler(req, res){
    
    const method = req.method;
    const { company_id } = req.query;
    switch(method){
        case "GET":
            try{
                const query = "SElECT c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship FROM company c JOIN sector s on (c.sector_id = s.id) WHERE c.id = ?";
                //use sector_id as link to that sector
                const data = await doquery({query: query,values: [company_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "PUT":
            try{
                const {company_name, sector_id, is_internship} = req.body.company;
                const query = "UPDATE company SET company_name = ?, sector_id = ?, is_internship = ? WHERE id = ?"
                const data = await doquery({query: query,values: [company_name, sector_id, is_internship, company_id]});
                res.status(200).json({message: data });
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM company WHERE id = ?"
                const data = await doquery({query: query,values: [company_id]});
                res.status(200).json({message: data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}