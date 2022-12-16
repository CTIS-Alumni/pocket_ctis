import {doquery} from "../../helpers/dbconnect";

export default async function handler(req, res){
    const method = req.method;
    switch(method){
        case "GET":
            let values = [];
            try{
                let query = "select c.id, c.company_name, c.sector_id, s.sector_name, c.is_internship " +
                "FROM company c JOIN sector s on (c.sector_id = s.id) ";
                //use is_internship to show some little icon or sth next to it to indicate its an internship company
                //if it is internship company show its rating next to it -> if rating is NULL dont show any stars, if 0 show empty star
                //use sector_id as link to its page

                if(req.query.sector_id){ //for a specific sectors page
                    query += "WHERE s.id = ? ";
                    values.push(req.query.sector_id);
                }
                if(req.query.name){ //for the general search
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND c.company_name LIKE CONCAT('%', ?, '%') "
                    else query += "WHERE c.company_name LIKE CONCAT('%', ?, '%') ";
                    values.push(req.query.name);
                }
                if(req.query.internship){//for the internships page
                    if(query.indexOf("WHERE") !== -1)//if there is "WHERE"
                        query += "AND c.is_internship = ? "
                    else query += "WHERE c.is_internship = ? ";
                    values.push(req.query.internship);
                }

                query += "order by c.company_name asc";

                const companies = await doquery({query: query, values: values});
                if(companies.hasOwnProperty("error"))
                    res.status(500).json({error: companies.error.message});
                else
                    res.status(200).json({companies});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
        case "POST":
            try{
                const {company_name, sector_id, is_internship} = req.body.company;
                const query = "INSERT INTO company(company_name, sector_id, is_internship) values(?,?,?)";
                const data = await doquery({query: query, values: [company_name, sector_id, is_internship]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({error: error.message});
            }
    }
}