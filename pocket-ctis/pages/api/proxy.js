export default async function handler(req, res){
    try {
        const url = req.headers['x-url'];
        const cookies = req.headers.cookie;
        const apiKey = process.env.API_KEY;

        let headers = {
            'Authorization': `Bearer ${apiKey}`,
            Cookie: cookies
        };

        console.log("heres the url", url)

        const results = await fetch(url, {
            headers: headers,
            credentials: 'include',
        });

        const responseData = await results.json();
        console.log("heres the responseData", responseData," from", url)

        res.status(results.status).json(responseData);
    } catch (error) {
        console.log("heres the error", error)
        const url = req.headers['x-url'];
        console.log("the url for the error şs", url);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}