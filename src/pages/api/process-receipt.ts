// src/pages/api/process-receipt.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createWalletPass } from '../../lib/googleWalletApi';

type ResponseData = {
  walletUrl?: string | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { receiptData } = req.body;

    if (!Array.isArray(receiptData) || receiptData.length === 0) {
      return res.status(400).json({ error: 'Invalid receipt data provided.' });
    }


    const walletUrl = await createWalletPass(receiptData); // receiptData is ExtractedReceiptItem[]


    if (!walletUrl) {
      return res.status(500).json({ error: 'Failed to create Google Wallet pass.' });
    }

    return res.status(200).json({ walletUrl });
  } catch (error: unknown) {
    console.error('Error in /api/process-receipt:', error);
    return res.status(500).json({ error: (error as Error).message || 'An unknown error occurred.' });
  }
}
