const https = require('https');

exports.initializeTransaction = (req, res) => {
    const { email, amount } = req.body;

    const params = JSON.stringify({
        email,
        amount: amount * 100 // Convert to kobo
    });

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            const response = JSON.parse(data);
            res.json(response);
        });
    });

    apiReq.on('error', error => {
        console.error(error);
        res.status(500).json({ error: error.message });
    });

    apiReq.write(params);
    apiReq.end();
};
