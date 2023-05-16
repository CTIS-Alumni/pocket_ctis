export const checkApiKey = (handler) => async (req, res) => {
    if(req.method === "GET"){
        const apiKey = req.headers.authorization.replace('Bearer', '').trim();

        if (!apiKey || apiKey !== process.env.API_KEY) {
            return res.status(401).json({ errors: [{error: 'Unauthorized'}] });
        }
    }
    return handler(req, res);
};