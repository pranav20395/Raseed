// pages/api/charts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleAuth } from 'google-auth-library'; // Import GoogleAuth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, query_type , user_id } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt request body.' });
  }

  try {
    // Instantiate GoogleAuth
    const auth = new GoogleAuth();
    // Get the target audience for the ID token (the URL of your Cloud Run service)
    const targetAudience = 'https://expense-agent-57041492042.us-west1.run.app';

    // Get an ID token for the target audience
    // This will automatically use the service account attached to your Next.js Cloud Run service
    const client = await auth.getIdTokenClient(targetAudience);
    const idToken = await client.idTokenProvider.fetchIdToken(targetAudience);

    if (!idToken) {
      return res.status(500).json({ error: 'Failed to obtain ID token.' });
    }

    const cloudRunResponse = await fetch(targetAudience, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`, // Use the dynamically obtained ID token
      },
      body: JSON.stringify({ prompt, query_type , user_id }),
    });

    const data = await cloudRunResponse.json();
    return res.status(cloudRunResponse.status).json(data);
  } catch (error: unknown) {
    console.error('Error calling Cloud Run function:', error);
    // You might want to log the specific error details for debugging in production
    return res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
}

