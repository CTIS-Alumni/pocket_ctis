import {createDBConnection} from "../../helpers/dbHelpers";
import {checkAuth, checkUserType} from "../../helpers/authHelper";
import {checkApiKey} from "./middleware/checkAPIkey";

const blacklist_words = [
    "update",
    " set ",
    "insert",
    "delete",
    "hashed",
    "username",
    "usercredential",
    "alter",
    "table",
    "drop",
    "truncate",
    "exec",
    "system",
    "shell",
    "cmd",
    "bash",
    "file",
    "read",
    "write",
    "append",
    "copy",
    "grant",
    "execute"
]

const handler =  async (req, res) => {
    console.log("here 1")
    const session = await checkAuth(req.headers, res);
    console.log("here 2", session)
    const payload = await checkUserType(session, req.query);
    console.log("here 3", payload)
    if (session && payload.user === "admin") {
        const method = req.method;
        switch (method) {
            case "POST":
                try {
                    const {query} = JSON.parse(req.body);

                    const lowercase_query = query.toLowerCase();

                    let blacklisted_word = false;
                    for (const word of blacklist_words) {
                        if (lowercase_query.includes(word)){
                            blacklisted_word = true;
                            break;
                        }
                    }

                    if(blacklisted_word)
                        throw {code: 403, message: "Forbidden query!"};

                    const connection = await createDBConnection();
                    const [results] = await connection.query(lowercase_query);

                    res.status(200).json({data: results});

                } catch (error) {
                    let code = 500;
                    if(error.code)
                        code = error.code;
                    res.status(code).json({errors: [{error: error.message}]});
                }
                break;
        }
    } else {
        res.status(403).json({errors: [{error: "Forbidden request!"}]})
    }
}


export default checkApiKey(handler);