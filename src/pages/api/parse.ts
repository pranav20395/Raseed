// pages/api/parse.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleAuth } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, gcs_uri, query_type, user_id, receipt_id } = req.body;

  if (!prompt || !gcs_uri || !query_type) {
    return res.status(400).json({ error: 'Missing prompt, gcs_uri, or query_type in request body.' });
  }

  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient('https://expense-agent-57041492042.us-west1.run.app');
    const url = 'https://expense-agent-57041492042.us-west1.run.app';

    // Send all fields expected by Cloud Run
    const cloudRunResponse = await client.request({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { prompt, gcs_uri, query_type, user_id, receipt_id },
    });

    return res.status(cloudRunResponse.status).json(cloudRunResponse.data);
  } catch (error: unknown) {
    console.error('Error calling Cloud Run function:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
}
