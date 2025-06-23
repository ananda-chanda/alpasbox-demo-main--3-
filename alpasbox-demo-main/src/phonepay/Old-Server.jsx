const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Your PhonePe credentials (replace with actual credentials)
const merchantId = 'your-merchant-id';
const merchantKey = 'your-merchant-key';
const phonePeApiUrl = 'https://api.phonepe.com/v3/payment/initiate';

function generateSignature(params) {
    const sortedKeys = Object.keys(params).sort();
    const data = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    const hash = crypto.createHmac('sha256', merchantKey).update(data).digest('hex');
    return hash;
}

app.post('/initiatePayment', async (req, res) => {
    const { amount, orderId, customerId } = req.body;

    // Create the payment request data for PhonePe
    const params = {
        merchantId,
        amount,
        orderId,
        customerId,
        callbackUrl: 'https://your-callback-url.com',  // Define a callback URL
    };

    // Generate signature using the provided merchant key
    const signature = generateSignature(params);

    try {
        const response = await axios.post(phonePeApiUrl, {
            ...params,
            signature,
        });

        // Return the response (payment URL) to frontend
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
