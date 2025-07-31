"use client";

import { useSession } from "next-auth/react";
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import GamifiedSavings, { GoogleWalletButton } from '../components/dashboard/GamifiedSavings';
import PersonalFinanceAdvisor from '../components/dashboard/PersonalFinanceAdvisor';
import SmartCart from '../components/dashboard/SmartCart';
import WarrantyTracker from '../components/dashboard/WarrantyTracker';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export const dynamic = 'force-dynamic';

interface SpendingItem {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

interface SavingsGoal {
  name: string;
  target: number;
  current: number;
  progress: number;
}

interface WarrantyItem {
  id: number;
  name: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: 'Active' | 'Expired';
}

interface SmartCartItem {
  id: number;
  name: string;
  lastPurchase: string;
  frequency: string;
}

interface ExtractedReceiptItem {
  category: string;
  item_name: string;
  item_value: number;
  receipt_date: string;
  receipt_id: string;
  shop_name: string;
  user_id?: string | null;
}

interface HomePageProps {
  session: any;
}

const HomePage: React.FC<HomePageProps> = ({ session: serverSession }) => {
  const { data: clientSession, status } = useSession();
  const router = useRouter();

  // Use client session if available, else fallback to server session
  const session = clientSession ?? serverSession;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login"); // <-- Use your custom login page
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
        <span className="text-lg text-indigo-600 font-semibold animate-pulse">Loading...</span>
      </div>
    );
  }
  if (!session) {
    return null;
  }

  const [spendingData] = useState<SpendingItem[]>([ /* initial data */ ]);
  const [savingsGoals] = useState<SavingsGoal[]>([ /* initial data */ ]);
  const [warrantyItems] = useState<WarrantyItem[]>([ /* initial data */ ]);
  const [smartCartItems] = useState<SmartCartItem[]>([ /* initial data */ ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState<File | null>(null);
  const [receiptUploadLoading, setReceiptUploadLoading] = useState(false);
  const [receiptUploadMessage, setReceiptUploadMessage] = useState('');
  const [extractedReceiptData, setExtractedReceiptData] = useState<ExtractedReceiptItem[] | null>(null);
  const [walletCreationLoading, setWalletCreationLoading] = useState(false);
  const [walletUrl, setWalletUrl] = useState<string | null>(null);
  const [walletCreationMessage, setWalletCreationMessage] = useState('');

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const projectedSavings = savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);

  const handleReceiptUpload = () => {
    setIsReceiptModalOpen(true);
    setSelectedReceiptFile(null);
    setReceiptUploadMessage('');
    setExtractedReceiptData(null);
    setWalletUrl(null);
    setWalletCreationMessage('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedReceiptFile(file);
    setReceiptUploadMessage(file ? `Selected: ${file.name}` : '');
  };

  const processReceiptImage = async () => {
    if (!selectedReceiptFile) {
      setReceiptUploadMessage('Please select an image file first.');
      return;
    }

    setReceiptUploadLoading(true);
    setReceiptUploadMessage('Reading file and processing receipt...');

    const reader = new FileReader();
    reader.readAsDataURL(selectedReceiptFile);

    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: reader.result, filename: `receipt_${Date.now()}.jpeg` }),
          });

          const uploadResult = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadResult.error || 'Upload failed');

          const userId = session?.user?.id || 'anonymous';
          const res = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: 'upload',
              query_type: 'upload',
              gcs_uri: uploadResult.gcsUri,
              user_id: userId,
              receipt_id: Date.now(),
            }),
          });

          const result = await res.json();
          if (res.ok) {
            setExtractedReceiptData(result.text);
            setReceiptUploadMessage('Receipt processed successfully!');
          } else {
            setReceiptUploadMessage(`Cloud Run Error: ${result.error}`);
          }
        } catch (error: any) {
          setReceiptUploadMessage(error.message || 'Unexpected error');
        } finally {
          setReceiptUploadLoading(false);
        }
      }
    };

    reader.onerror = () => {
      setReceiptUploadMessage('Error reading file.');
      setReceiptUploadLoading(false);
    };
  };

  const handleCreateWalletPass = async () => {
    if (!extractedReceiptData) {
      setWalletCreationMessage('No extracted data available to create a pass.');
      return;
    }

    setWalletCreationLoading(true);
    setWalletUrl(null);
    setWalletCreationMessage('Creating Google Wallet pass...');

    try {
      const response = await fetch('/api/process-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptData: extractedReceiptData }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create wallet pass.');

      setWalletUrl(result.walletUrl);
      setWalletCreationMessage('Pass created successfully!');
    } catch (error) {
      setWalletCreationMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setWalletCreationLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-indigo-100 via-white to-indigo-200 font-inter text-gray-800">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Make main content scrollable */}
      <div className={`flex-1 flex flex-col h-screen overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} z-10`}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <SpendingOverview spendingData={spendingData} totalSpending={totalSpending} totalSavings={totalSavings} projectedSavings={projectedSavings} />
            </div>
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <GamifiedSavings savingsGoals={savingsGoals} handleReceiptUpload={handleReceiptUpload} />
            </div>
          </section>

          <section className="lg:col-span-1 space-y-8">
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <PersonalFinanceAdvisor spendingData={spendingData} savingsGoals={savingsGoals} />
            </div>
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <SmartCart smartCartItems={smartCartItems} />
            </div>
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-indigo-100">
              <WarrantyTracker warrantyItems={warrantyItems} />
            </div>
          </section>
        </main>

        <footer className="mt-8 text-center text-gray-500 text-sm p-4">
          <p>
            Powered by <span className="font-semibold text-indigo-600">vibecoderz</span> for smart financial insights.
            <br />
            <span className="font-medium">Local Language Support:</span> Insights and advice in your preferred language.
          </p>
        </footer>
      </div>

      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Upload Receipt for AI Scan"
        footer={
          <div className="flex space-x-2">
            <Button onClick={() => setIsReceiptModalOpen(false)} variant="secondary" disabled={receiptUploadLoading || walletCreationLoading}>Close</Button>
            <Button onClick={processReceiptImage} disabled={!selectedReceiptFile || receiptUploadLoading || !!extractedReceiptData}>
              {receiptUploadLoading ? 'Processing...' : 'Upload & Scan'}
            </Button>
          </div>
        }
      >
        <div className="mb-4 text-gray-700">
          Upload an image of your receipt. Our AI will extract key details like total amount, items, and date.
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {receiptUploadMessage && (
          <p className={`mt-3 text-sm ${receiptUploadLoading ? 'text-blue-600' : (extractedReceiptData?.length ? 'text-green-600' : 'text-red-600')}`}>
            {receiptUploadMessage}
          </p>
        )}

        {extractedReceiptData && extractedReceiptData.length > 0 && (
          <>
            <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-200 max-h-[300px] overflow-y-auto">
              <h5 className="font-semibold text-indigo-700 mb-2">Extracted Receipt Items:</h5>
              <ul className="text-sm space-y-2">
                {extractedReceiptData.map((item, index) => (
                  <li key={index} className="border-b border-indigo-100 pb-2">
                    <p><strong>Item:</strong> {item.item_name}</p>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Amount:</strong> ₹{item.item_value.toFixed(2)}</p>
                    <p><strong>Shop:</strong> {item.shop_name}</p>
                    <p><strong>Date:</strong> {new Date(item.receipt_date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-200 flex flex-col items-center">
              {walletUrl ? (
                <GoogleWalletButton href={walletUrl} />
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleCreateWalletPass} disabled={walletCreationLoading}>
                    {walletCreationLoading ? 'Creating Pass...' : 'Save to Google Wallet'}
                  </Button>
                  <Button onClick={() => setIsReceiptModalOpen(false)} variant="secondary" disabled={walletCreationLoading}>
                    Skip
                  </Button>
                </div>
              )}
              {walletCreationMessage && (
                <p className={`mt-2 text-sm text-center ${walletUrl ? 'text-green-600' : 'text-red-600'}`}>
                  {walletCreationMessage}
                </p>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { session } };
};