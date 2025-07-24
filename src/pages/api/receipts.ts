
// // src/api/receipts.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { callGeminiVisionApi } from '../../lib/geminiApi'; // Import the new vision API function
// import formidable from 'formidable'; // For handling multipart/form-data
// import fs from 'fs'; // Node.js built-in file system module
// import path from 'path'; // Node.js built-in path module

// // Define the expected structure of the extracted receipt data
// interface ExtractedReceiptData {
//   totalAmount?: number;
//   date?: string;
//   items?: { name: string; price: number }[];
//   category?: string;
//   warrantyInfo?: string;
// }


// // Disable Next.js body parser to allow formidable to handle the request body
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ExtractedReceiptData | { error: string }>
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   // Initialize formidable to parse the incoming form data
//   const form = formidable({ multiples: false }); // Expecting a single file upload

//   try {
//     // Parse the request to get fields and files
//     const [fields, files] = await form.parse(req);
//     const receiptImageFile = files.receiptImage?.[0]; // Access the uploaded file

//     if (!receiptImageFile) {
//       return res.status(400).json({ error: 'No image file uploaded.' });
//     }

//     // Read the file buffer from the temporary path created by formidable
//     const imageBuffer = fs.readFileSync(receiptImageFile.filepath);
//     // Convert the image buffer to a Base64 string, which is required by Gemini API
//     const base64Image = imageBuffer.toString('base64');
//     // Determine the MIME type of the uploaded image
//     const mimeType = receiptImageFile.mimetype || 'image/jpeg'; // Default to jpeg if not detected

//     // Define the prompt for the Gemini Vision API to extract structured data
//     // The prompt explicitly asks for JSON output with specific fields.
//     const prompt = `
//       Analyze this receipt image and extract the following information in JSON format.
//       If a field is not found, omit it.
//       {
//         "totalAmount": <number, e.g., 25.75>,
//         "date": "<string, e.g., YYYY-MM-DD>",
//         "items": [
//           {"name": "<string>", "price": <number>},
//           {"name": "<string>", "price": <number>}
//         ],
//         "category": "<string, e.g., Groceries, Electronics, Dining>",
//         "warrantyInfo": "<string, any text indicating warranty terms or duration>"
//       }
//     `;

//     // Call the Gemini Vision API using the imported function
//     // The API key is handled by the Canvas environment for security.
//     const llmResponseText = await callGeminiVisionApi(prompt, {
//       mimeType: mimeType,
//       data: base64Image,
//     });

//     if (!llmResponseText) {
//       return res.status(500).json({ error: 'Failed to get a response from the AI.' });
//     }

//     let extractedData: ExtractedReceiptData = {};
// try {
//   // Remove Markdown code block markers if present
//   const cleanedResponse = llmResponseText
//     .replace(/```json/g, '')
//     .replace(/```/g, '')
//     .trim();

//   extractedData = JSON.parse(cleanedResponse);
// } catch (parseError) {
//   console.error('Failed to parse LLM response as JSON:', parseError);
//   return res.status(500).json({ error: 'AI response was not valid JSON. Raw response: ' + llmResponseText });
// }

//     // Clean up the temporary file created by formidable to prevent disk space issues
//     fs.unlinkSync(receiptImageFile.filepath);

//     // Send the extracted structured data back to the client
//     return res.status(200).json(extractedData);

//   } catch (error) {
//     console.error('Error processing receipt upload:', error);
//     // Provide a more informative error message to the client
//     return res.status(500).json({ error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` });
//   }
// }