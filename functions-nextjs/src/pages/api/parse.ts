// pages/api/parse.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { prompt, gcs_uri } = req.body;

  if (!prompt || !gcs_uri) {
    return res.status(400).json({ error: 'Missing prompt or gcs_uri in request body.' });
  }

  try {

    const metadataToken = await fetch('http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://expense-agent-57041492042.us-west1.run.app', {
      headers: { 'Metadata-Flavor': 'Google' },
    }).then((r) => r.text());

    const cloudRunResponse = await fetch('https://expense-agent-57041492042.us-west1.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${metadataToken}`, // ID token
      },
      body: JSON.stringify({ prompt, gcs_uri }),
    });

    const data = await cloudRunResponse.json();
    return res.status(cloudRunResponse.status).json(data);
  } catch (error: any) {
    console.error('Error calling Cloud Run function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
