import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const get_companies_query = "select c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship " +
                    "FROM company c JOIN sector s on (c.sector_id = s.id) order by c.company_name asc"
                //use is_internship to show some little icon or sth next to it to indicate its an internship company
                //if it is internship company show its rating next to it -> if rating is NULL dont show any stars, if 0 show empty star
                //use sector_id as link to its page

                const data = await doquery({query: get_companies_query});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_name, sector_id, is_internship} = req.body.company;
                const post_company_query = "INSERT INTO company(company_name, sector_id, is_internship) values(?,?,?)";
                const data = await doquery({query: post_company_query, values: [company_name, sector_id, is_internship]});
                res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}