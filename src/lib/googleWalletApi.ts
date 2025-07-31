import { GoogleAuth } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';

// Load from environment variables
// const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SERVICE_ACCOUNT_EMAIL = "bhavikajangid02@smart-wallet-b9b00.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4njDnw47ahn1l\ncFy/Xc8ldNS2B+deDezYooW0wnOwTy3bJC5eBNb0Srf2DZe7PQQfm7NN/okvNS6b\nqSkEOMp52PqtWsrAmVEEebggCfUAKgkFwjq3YYCs0ovUV82PZnS2mFgPkG+UBQZ6\nvI9Q6sm9X+H3DImO3sSdgY2dgxO8I/UgVBgnGxcDtepHZE5yNVEh7xBnoh+waolq\niaVYVjIH4KQ5sz4rnJPgAsCtDFyClxG0c2+txZhHIRBVo5dRg1Mlv8HmEgNIfQkQ\nAUyOgdlxCRkB86AQxAiF7EOpwY2K/zyrHBStslMwZVAVZCxQOC/E3/KTw71EskdH\noBzy56rdAgMBAAECggEAAV+uo3rcDETl7U75vF7OqiEFbYP/imlLcuKQC3lK8mvp\nvnC1e55I7zEYegHojXcgbw/HNMmzwaCBWUfX9fUU5J/jCvkwUGCTrsHXxz1BD8rq\n8u+wD39FPYP6Ow6a3qSiMl2jLMfOshObfxGky12uj0nbB5iV9B806AB3yk1DD1T9\n6uLZ5gAtimZ5u0Qq/kIH8mzOOH/qYb/lyT0cbwogOlWuby1VuVDQa23UMpHAj/+2\n1q//eD00AOpJAKJocNs5IIZz3mI0FoC5lNQV/3uu0O86/fPT4UrWP0F7biKbDsT5\n7AYGII/tBG1saa+QA73DX41bcSVCEuV9XdXalsR3YQKBgQDtLTgvVd6svUb4Y1hJ\n7z50AyhnlnFy/6orBcaB/14y7Md8Ly9YSibEjLujOM84j7QmgaEt12EGJRHvx0IJ\np2L7iaKJcBF4cAUih18Nti2gLSI7OlcgheONyL86nutPTI1DmNzMeoqDFsqmXF5m\nfuYK+S5G+rKQfMKNJaH5xauNxQKBgQDHRR9Y4lgg1Ck7hOi1uH8RYCyvezO2I+si\nIL913EMZSVdliMyRX1cm3TV2fH1KOcjBsRHeUqCjOCFeXguY5lJlY/2EUISU+UnV\n+EXFSHxQCfVA5icsMAjK1R2gba7yGrsaUXHF4TxU5s196244RaBNDRqpwlhz6vy2\ndmTN+9xSOQKBgGZ7aZGaixMc3jOpyZZ42AWM78KC0RadvkvEvRei3nMmuLPCN7Tw\npXu8S7+lZnTMM02IKbsDG5tqHSv8b154g16pBCBa2lGuJanb0Ii+NUzG88mf1dHp\nyH+VRHvx+z9Slp+kx5NbR8qI6JulweyL3J7VONfWr52bKv2OS0T/0rb5AoGAbvWp\nf+gBpL4e+5qFrnK+puFD4K8c22Zizw0nL6zn3BO/y7UCHEzXjbeNxp2JcqR8ioZb\n6c1ez6Q4yIBbutc9uGGWUHA5c27g03m8+B7lwffZjjraQzu4GaHULnoE+aEy4HPL\ng6Fo4+nlMSHArSrwGReb6j1i3aFS+RMyDJUbWNkCgYAMi1mPqOK3iP54xNCXTsln\nFkYZytC6uCL6pF/Nynj5QR/ECerqUGQfjAzudmiIvQMmD0t5mIRxsSUXBA3FfDI4\n9gu7jS/AGN4X3hidNc+1zPcMH9ZHGlGIUtGn+DPUjAwIEUXVYs5Unp1b/4WH1ypu\nRQq8owhd0Qqp4/FsDMbtow==\n-----END PRIVATE KEY-----\n";

// Wallet constants
const WALLET_ISSUER_ID = '3388000000022958550';
const WALLET_OFFER_CLASS_SUFFIX = 'receipt-offer-v1';
const offerClassId = `${WALLET_ISSUER_ID}.${WALLET_OFFER_CLASS_SUFFIX}`;
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

// Auth setup
const auth = new GoogleAuth({
  credentials: {
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
});

interface ExtractedReceiptItem{
  category: string;
  item_name: string;
  item_value: number;
  receipt_date: string;
  receipt_id: string;
  shop_name: string;
  user_id?: string | null;
}

/**
 * Creates or ensures the Offer Class exists
 */
async function createOrGetOfferClass(): Promise<void> {
  try {
    await auth.request({
      url: `${baseUrl}/offerClass/${offerClassId}`,
      method: 'GET',
    });
    console.log(`Class ${offerClassId} already exists.`);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { status?: number } }).response?.status === 'number' &&
      (err as { response: { status: number } }).response.status === 404
    ) {
      console.log(`Class ${offerClassId} not found. Creating...`);
      const offerClass = {
        id: offerClassId,
        issuerName: 'Raseed',
        reviewStatus: 'UNDER_REVIEW',
        provider: 'Raseed Finance',
        redemptionChannel: 'INSTORE',
        title: 'Receipt',
        hexBackgroundColor: '#4285f4',
        logo: {
          sourceUri: {
            uri: 'https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg',
          },
          contentDescription: {
            defaultValue: {
              language: 'en-US',
              value: 'Raseed Logo',
            },
          },
        },
      };

      await auth.request({
        url: `${baseUrl}/offerClass`,
        method: 'POST',
        data: offerClass,
      });
      console.log(`Class ${offerClassId} created.`);
    } else {
      console.error('Error checking/creating class:', err);
      throw err;
    }
  }
}

/**
 * Create a Wallet Pass from extracted receipt items
 */
export async function createWalletPass(receiptItems: ExtractedReceiptItem[]): Promise<string | null> {
  try {
    if (!Array.isArray(receiptItems) || receiptItems.length === 0) {
      throw new Error('Receipt item array is empty or invalid.');
    }

    await createOrGetOfferClass();

    const storeName = receiptItems[0].shop_name || 'Unknown Store';
    const purchaseDate = receiptItems[0].receipt_date || new Date().toISOString().split('T')[0];
    const totalAmount = receiptItems.reduce((sum, item) => sum + item.item_value, 0);

    const validItems = receiptItems
      .filter(item => item.item_name && typeof item.item_value === 'number')
      .map(item => `${item.item_name.padEnd(20)} ₹${item.item_value.toFixed(2)}`)
      .join('\n');

    const detailsText = `ITEMIZED RECEIPT\n--------------------\n${validItems}\n\n--------------------\nTOTAL: ₹${totalAmount.toFixed(2)}`;

    const objectId = `${WALLET_ISSUER_ID}.${uuidv4()}`;
    const offerObject = {
      id: objectId,
      classId: offerClassId,
      state: 'ACTIVE',
      title: storeName,
      provider: 'Raseed',
      details: detailsText,
      barcode: { type: 'QR_CODE', value: objectId },
      textModulesData: [
        { header: 'Store', body: storeName, id: 'store' },
        { header: 'Total Amount', body: `₹${totalAmount.toFixed(2)}`, id: 'total_amount' },
        { header: 'Date of Purchase', body: purchaseDate, id: 'date' },
      ],
      linksModuleData: {
        uris: [
          {
            uri: 'https://smart-wallet-b9b00.web.app',
            description: 'Visit Raseed',
          },
        ],
      },
    };

    const claims = {
      iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      aud: 'google',
      typ: 'savetowallet',
      origins: ['http://localhost:3000'], // Update in production
      payload: {
        offerObjects: [offerObject],
      },
    };

    if (!GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing GOOGLE_PRIVATE_KEY');
    }

    const token = sign(claims, GOOGLE_PRIVATE_KEY, { algorithm: 'RS256' });
    return `https://pay.google.com/gp/v/save/${token}`;
  } catch (error) {
    console.error('Error creating wallet pass:', error);
    return null;
  }
}
