    // src/lib/geminiApi.ts

    // IMPORTANT SECURITY NOTE:
    // With this setup, your GEMINI_API_KEY will be exposed in the client's browser.
    // This is NOT recommended for production applications.
    // For secure API key handling, you should use server-side API routes (e.g., Next.js API Routes, Firebase Functions).AIzaSyDtc7q4X0zbAWq3QcWBCCY71oF2JCrVdpI

    const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    // const NEXT_PUBLIC_GEMINI_API_KEY = 'AIzaSyDtc7q4X0zbAWq3QcWBCCY71oF2JCrVdpI';

    /**
     * Calls the Gemini API with a given prompt and returns the generated text.
     * This function is intended for client-side use.
     * @param {string} prompt The text prompt to send to the LLM.
     * @returns {Promise<string|null>} The generated text from the LLM, or an error message.
     */
    export async function callGeminiApi(prompt: string): Promise<string | null> {
      if (!NEXT_PUBLIC_GEMINI_API_KEY) {
        console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set. Cannot call Gemini API from client-side.");
        return "Error: Client-side API key not configured. Please check your .env.local file.";
      }

      try {
        const chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          return result.candidates[0].content.parts[0].text;
        } else {
          console.error('Gemini API response structure unexpected:', result);
          return null;
        }
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        return null;
      }
    }

    /**
     * Calls the Gemini Vision API with a text prompt and image data.
     * This function is now also intended to be called from the client-side.
     * **The API key used here will be exposed in the client's browser.**
     * @param {string} prompt The text prompt to send to the LLM.
     * @param {{ mimeType: string; data: string }} imageData The image data in Base64 format with its mimeType.
     * @returns {Promise<string|null>} The generated text from the LLM, or an error message.
     */
    export async function callGeminiVisionApi(
      prompt: string,
      imageData: { mimeType: string; data: string }
    ): Promise<string | null> {
      if (!NEXT_PUBLIC_GEMINI_API_KEY) {
        console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set. Cannot call Gemini Vision API from client-side.");
        return "Error: Client-side API key not configured. Please check your .env.local file.";
      }

      try {
        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: imageData }
              ]
            }
          ],
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${NEXT_PUBLIC_GEMINI_API_KEY}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          return result.candidates[0].content.parts[0].text;
        } else {
          console.error('Gemini Vision API response structure unexpected:', result);
          return null;
        }
      } catch (error) {
        console.error('Error calling Gemini Vision API:', error);
        return null;
      }
    }
    