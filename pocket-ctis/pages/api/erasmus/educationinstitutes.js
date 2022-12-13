import {doquery} from "../../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const edu_inst_query = "SELECT ei.id, ei.inst_name, ci.city_name, co.country_name, ei.rating " +
                    "FROM educationinstitute ei LEFT OUTER JOIN city ci ON (ei.city_id = ci.id) " +
                    "LEFT OUTER JOIN country co ON (ci.country_id = co.id) " +
                    "WHERE ei.is_erasmus = true order by ei.inst_name asc";

                //use c.id and c.sector_id as links to their pages
                const edu_inst_list = await doquery({query:edu_inst_query});
                res.status(200).json({edu_inst_list});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}