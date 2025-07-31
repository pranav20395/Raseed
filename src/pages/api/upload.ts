// /pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();
const bucketName = 'smart-wallet-default'; // Your bucket name
const uploadDir = 'image'; // Folder path in the bucket

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if needed
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { base64, filename } = req.body;

  if (!base64) {
    return res.status(400).json({ error: 'Missing base64 image data.' });
  }

  try {
    const buffer = Buffer.from(base64.split(',')[1], 'base64');
    const uniqueFilename = filename || `receipt_${uuidv4()}.jpeg`;
    const filePath = `${uploadDir}/${uniqueFilename}`;
    const file = storage.bucket(bucketName).file(filePath);

    await file.save(buffer, {
      contentType: 'image/jpeg',
      resumable: false,
      metadata: {
        cacheControl: 'no-cache',
      },
    });

    const gcsUri = `gs://${bucketName}/${filePath}`;
    return res.status(200).json({ gcsUri });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image', details: (error as Error).message });
  }
}
