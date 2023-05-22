export const corsMiddleware = (handler) => async (req, res) => {

    const domain = process.env.NODE_ENV === "development" ? req.headers.host : process.env.DOMAIN_NAME;
    console.log("heres the domain", domain);

    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type', 'x-url');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Continue to the actual API handler
    return handler(req, res);
};