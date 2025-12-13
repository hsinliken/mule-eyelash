export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing "to" or "message"' });
    }

    const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

    if (!LINE_ACCESS_TOKEN) {
        console.error('LINE_CHANNEL_ACCESS_TOKEN is missing');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: to,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('LINE API Error:', data);
            return res.status(response.status).json({ error: 'Failed to send message', details: data });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Network Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
