import {createDBConnection} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";
import {corsMiddleware} from "./middleware/cors";

const blacklist_words = [
    " update ",
    " set ",
    " information_schema ",
    " escape ",
    " session ",
    " tables ",
    " column ",
    " constraint ",
    " indexes ",
    " variables ",
    " flush ",
    " transaction ",
    " release ",
    " savepoint ",
    " rollback ",
    " show ",
    " describe ",
    " explain ",
    " outfile ",
    " infile ",
    " replace ",
    " grant ",
    " revoke ",
    " columns " ,
    " commit ",
    " lock ",
    " unlock ",
    " create ",
    " table_schema ",
    " database() ",
    " insert ",
    " delete ",
    " hashed ",
    " username ",
    " usercredential ",
    " alter ",
    " table ",
    " drop ",
    " processlist ",
    " truncate ",
    " into ",
    " warnings ",
    " call ",
    " errors ",
    " exec ",
    " system ",
    " shell ",
    " cmd ",
    " bash ",
    " file ",
    " read ",
    " write ",
    " append ",
    " copy ",
    " execute "
]

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    const payload = await checkUserType(session, req.query);
    if (session && payload.user === "admin") {
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const {query} = JSON.parse(req.body);

                    const lowercase_query = " " + query.toLowerCase() + " ";

                    let blacklisted_word = false;
                    for (const word of blacklist_words) {
                        if (lowercase_query.includes(word)){
                            blacklisted_word = true;
                            break;
                        }
                    }

                    if(blacklisted_word)
                        throw { message: "Forbidden query!"};

                    const connection = await createDBConnection();
                    const [results] = await connection.query(lowercase_query);

                    res.status(200).json({data: results});

                } catch (error) {
                    res.status(500).json({errors: [{error: error.message}]});
                }
                break;
        }
    } else {
        res.status(403).json({errors: [{error: "Forbidden request!"}]})
    }
}


export default corsMiddleware(checkApiKey(handler));