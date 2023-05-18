export default async function handler(req, res){
    try {
        const url = req.headers['x-url'];
        const cookies = req.headers.cookie;
        const apiKey = process.env.API_KEY;

        let headers = {
            'Authorization': `Bearer ${apiKey}`,
            Cookie: cookies
        };

        const results = await fetch(url, {
            headers: headers,
            credentials: 'include',
        });

        const {data, errors, length} = await results.json();

        res.status(results.status).json({data, length, errors});
    } catch (error) {
        console.log("error from ", req.url, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}