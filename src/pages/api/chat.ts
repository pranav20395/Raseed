// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleAuth } from 'google-auth-library'; // Import GoogleAuth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure only POST requests are allowed
  if (req.method !== 'POST') {
    console.warn(`Method Not Allowed: Received ${req.method} request, expected POST.`);
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are supported.' });
  }

  // Destructure prompt, query_type, and user_id from the request body
  const { prompt, query_type, user_id } = req.body;

  // Validate that a prompt is provided
  if (!prompt) {
    console.error('Bad Request: Missing "prompt" in request body.');
    return res.status(400).json({ error: 'Bad Request', message: 'Missing "prompt" in request body.' });
  }

  // Define the target audience for the ID token, which is the URL of your Cloud Run service
  const targetAudience = 'https://expense-agent-57041492042.us-west1.run.app';

  try {
    // Step 1: Obtain ID Token for Cloud Run Authentication
    console.log('Attempting to obtain ID token for Cloud Run service...');
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(targetAudience);
    const idToken = await client.idTokenProvider.fetchIdToken(targetAudience);

    if (!idToken) {
      console.error('Authentication Error: Failed to obtain ID token for Cloud Run service.');
      return res.status(500).json({ error: 'Authentication Error', message: 'Could not obtain ID token for Cloud Run service. Check service account permissions.' });
    }
    console.log('Successfully obtained ID token.');

    // Step 2: Call your Cloud Run service with the authenticated request
    console.log(`Calling Cloud Run service at: ${targetAudience}`);
    const cloudRunResponse = await fetch(targetAudience, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`, // Attach the ID token for authentication
      },
      // Send the prompt, query_type, and user_id to your Cloud Run service
      body: JSON.stringify({ prompt, query_type, user_id }),
    });

    // Step 3: Handle the response from Cloud Run
    // Check if the Cloud Run response was successful (status 2xx)
    if (!cloudRunResponse.ok) {
      const errorData = await cloudRunResponse.text(); // Get raw text for better debugging
      console.error(`Cloud Run Service Error: Status ${cloudRunResponse.status}, Body: ${errorData}`);
      return res.status(cloudRunResponse.status).json({
        error: 'Cloud Run Service Error',
        message: `Cloud Run service responded with status ${cloudRunResponse.status}.`,
        details: errorData // Include the raw response body for debugging
      });
    }

    // If Cloud Run response is OK, parse its JSON and forward it
    const data = await cloudRunResponse.json();
    console.log('Successfully received response from Cloud Run service.');
    return res.status(cloudRunResponse.status).json(data);

  } catch (error: unknown) {
    // Catch any errors that occur during token acquisition or the fetch call itself
    console.error('Unhandled Server Error in /api/parse:', error);

    // Return a generic internal server error to the client, with error details
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.',
      details: (error as Error).message || 'No specific error message available.' // Provide error message for debugging
    });
  }
}
