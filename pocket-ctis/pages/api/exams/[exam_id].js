import {doquery, doqueryNew} from "../../../helpers/dbHelpers";
import {checkAuth} from "../../../helpers/authHelper";
import {checkApiKey} from "../middleware/checkAPIkey";

const handler =  async (req, res) => {
    const session = await checkAuth(req.headers, res);
    if (session) {
    const { exam_id } = req.query;
    const method = req.method;
    switch(method){
        case "GET":
            try{
                const query = "SELECT * FROM exam WHERE id = ?";
                const {data, errors} = await doqueryNew({query: query,values: [exam_id]});
                res.status(200).json({data, errors});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "PUT":
            try{
                const {exam_name} = req.body.exam;
                const query = "UPDATE exam SET exam_name = ? WHERE id = ?";
                const data = await doquery({query: query,values: [exam_name, exam_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
        case "DELETE":
            try{
                const query = "DELETE FROM exam WHERE id = ?";
                const data = await doquery({query:query,values: [exam_id]});
                if(data.hasOwnProperty("error"))
                    res.status(500).json({error: data.error.message});
                else
                    res.status(200).json({data});
            }catch(error){
                res.status(500).json({errors: [{error: error.message}]});
            }
            break;
    }
    }else{
        res.redirect("/401", 401);
    }
}
export default checkApiKey(handler);