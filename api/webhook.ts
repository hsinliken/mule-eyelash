
import { createHmac } from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Signature Validation (LINE requires this to verify the request comes from LINE)
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    const signature = req.headers['x-line-signature'];

    if (!channelSecret) {
        console.error('LINE_CHANNEL_SECRET is missing');
        // Return 200 to allow setting webhook even if env is missing (for initial setup), but log error
        return res.status(200).json({ status: 'OK', warning: 'Missing Secret' });
    }

    // If signature is present, verify it
    if (signature) {
        const body = JSON.stringify(req.body);
        const hash = createHmac('sha256', channelSecret).update(body).digest('base64');
        if (hash !== signature) {
            console.error('Invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }

    // 2. Handle Events
    const events = req.body.events || [];

    // For Webhook Verification, LINE sends one or more dummy events (replyToken: 0000...)
    // Or simply expects a 200 OK.

    // We don't necessarily need to do anything here unless we want to handle USER MESSAGES.
    // For now, we just return 200 to confirm we received it.

    console.log('Received events:', events);

    return res.status(200).json({ status: 'OK' });
}
