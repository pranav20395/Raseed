/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Firebase Functions with TypeScript!" });
});

// Export the Express app as a single Cloud Function:
export const api = functions.https.onRequest(app);
