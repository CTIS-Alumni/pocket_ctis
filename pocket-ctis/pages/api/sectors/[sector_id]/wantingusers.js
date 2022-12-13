import {doquery} from "../../../../helpers/dbconnect";

export default async function handler(req, res){
    const {sector_id} = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const user_want_query = "SELECT uws.id, uws.user_id, upp.profile_picture, upp.visibility as 'pic_visibility', u.first_name, u.last_name, uws.visibility as 'record_visibility' " +
                    "FROM userwantsector uws JOIN users u ON (uws.user_id = u.id) " +
                    "JOIN userprofilepicture upp ON (uws.user_id = upp.user_id) " +
                    "WHERE uws.sector_id = ?";
                //if record_visibility = false, make the pic invisible even if pic_visibility is true, make first and lastname invisible
                //if record_visibility = true, use pic visibility -> invisible pic means use defaultuser.png to be put under public/

                const user_want_list = await doquery({query: user_want_query, values: [sector_id]});
                res.status(200).json({user_want_list});
            }catch(error){
                res.status(500).json({error: error.message});
            }
            break;
    }
}