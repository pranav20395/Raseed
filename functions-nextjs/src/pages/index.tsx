// pages/index.tsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import GamifiedSavings from '../components/dashboard/GamifiedSavings';
import PersonalFinanceAdvisor from '../components/dashboard/PersonalFinanceAdvisor';
import SmartCart from '../components/dashboard/SmartCart';
import WarrantyTracker from '../components/dashboard/WarrantyTracker';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
// import { callGeminiVisionApi } from '../lib/geminiApi'; // Import the Vision API function directly

// Define interfaces for your data structures
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

// Interface for extracted receipt data (matches LLM output)
interface ExtractedReceiptData {
  totalAmount?: number;
  date?: string;
  items?: { name: string; price: number }[];
  category?: string;
  warrantyInfo?: string;
}

const HomePage: React.FC = () => {
  // Mock data for demonstration purposes
  const [spendingData, _setSpendingData] = useState<SpendingItem[]>([
    { category: 'Groceries', amount: 450, color: '#EF4444', percentage: 25 },
    { category: 'Utilities', amount: 180, color: '#3B82F6', percentage: 10 },
    { category: 'Transport', amount: 120, color: '#F59E0B', percentage: 7 },
    { category: 'Dining Out', amount: 200, color: '#10B981', percentage: 11 },
    { category: 'Entertainment', amount: 90, color: '#8B5CF6', percentage: 5 },
    { category: 'Shopping', amount: 300, color: '#EC4899', percentage: 17 },
    { category: 'Rent', amount: 500, color: '#6B7280', percentage: 25 },
  ]);

  const [savingsGoals, _setSavingsGoals] = useState<SavingsGoal[]>([
    { name: 'New Gadget', target: 1000, current: 650, progress: 65 },
    { name: 'Vacation Fund', target: 2500, current: 800, progress: 32 },
    { name: 'Emergency Fund', target: 5000, current: 3500, progress: 70 },
  ]);

  const [warrantyItems, _setWarrantyItems] = useState<WarrantyItem[]>([
    { id: 1, name: 'Smart TV', purchaseDate: '2023-01-15', warrantyEndDate: '2026-01-15', status: 'Active' },
    { id: 2, name: 'Laptop', purchaseDate: '2024-03-10', warrantyEndDate: '2025-03-10', status: 'Active' },
    { id: 3, name: 'Coffee Machine', purchaseDate: '2023-09-01', warrantyEndDate: '2024-09-01', status: 'Expired' },
  ]);

  const [smartCartItems, _setSmartCartItems] = useState<SmartCartItem[]>([
    { id: 1, name: 'Organic Milk', lastPurchase: '2 weeks ago', frequency: 'Bi-weekly' },
    { id: 2, name: 'Coffee Beans', lastPurchase: '1 month ago', frequency: 'Monthly' },
    { id: 3, name: 'Laundry Detergent', lastPurchase: '3 weeks ago', frequency: 'Monthly' },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState<File | null>(null);
  const [receiptUploadLoading, setReceiptUploadLoading] = useState<boolean>(false);
  const [receiptUploadMessage, setReceiptUploadMessage] = useState<string>('');
  const [extractedReceiptData, setExtractedReceiptData] = useState<ExtractedReceiptData | null>(null);

  // Calculate total spending for the overview
  const totalSpending: number = spendingData.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings: number = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const projectedSavings: number = savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);

  // Function to open the receipt upload modal
  const handleReceiptUpload = (): void => {
    setIsReceiptModalOpen(true);
    setSelectedReceiptFile(null);
    setReceiptUploadMessage('');
    setExtractedReceiptData(null);
  };

  // Handle file selection and read as Base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedReceiptFile(file);
      setReceiptUploadMessage(`Selected: ${file.name}`);
    } else {
      setSelectedReceiptFile(null);
      setReceiptUploadMessage('');
    }
  };

  // Function to process the selected receipt image with LLM directly from client
  const processReceiptImage = async (): Promise<void> => {
    if (!selectedReceiptFile) {
      setReceiptUploadMessage('Please select an image file first.');
      return;
    }

    setReceiptUploadLoading(true);
    setReceiptUploadMessage('Reading file and processing receipt...');

    const reader = new FileReader();
    reader.readAsDataURL(selectedReceiptFile); // Read file as Data URL (Base64)

    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        const prompt = `...`;
    
        try {
          const res = await fetch('/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              gcs_uri: 'gs://smart-wallet-default/receipt.jpeg', // hardcoded for now
            }),
          });
    
          const result = await res.json();
    
          if (res.ok) {
            setExtractedReceiptData(result);
            setReceiptUploadMessage('Receipt processed successfully via Cloud Run!');
          } else {
            console.error('Cloud Run Error:', result);
            setReceiptUploadMessage(`Cloud Run Error: ${result.error}`);
          }
        } catch (error) {
          console.error('API call failed:', error);
          setReceiptUploadMessage(`Failed to call API: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setReceiptUploadLoading(false);
        }
      }
    };
    

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setReceiptUploadMessage('Error reading file.');
      setReceiptUploadLoading(false);
    };
  };


  return (
    <div className="flex min-h-screen bg-gray-100 font-inter text-gray-800">
      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} z-10`}>
        {/* Header Component */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Spending Insights & Gamified Savings */}
          <section className="lg:col-span-2 space-y-6">
            <SpendingOverview
              spendingData={spendingData}
              totalSpending={totalSpending}
              totalSavings={totalSavings}
              projectedSavings={projectedSavings}
            />
            <GamifiedSavings
              savingsGoals={savingsGoals}
              handleReceiptUpload={handleReceiptUpload}
            />
          </section>

          {/* Right Column - Personal Finance Advisor, Smart Cart, Warranty Tracker */}
          <section className="lg:col-span-1 space-y-6">
            <PersonalFinanceAdvisor
              spendingData={spendingData}
              savingsGoals={savingsGoals}
            />
            <SmartCart
              smartCartItems={smartCartItems}
            />
            <WarrantyTracker
              warrantyItems={warrantyItems}
            />
          </section>
        </main>

        {/* Footer (Placeholder for local language support info) */}
        <footer className="mt-8 text-center text-gray-500 text-sm p-4">
          <p>
            Powered by vibecoderz for smart financial insights.
            <br />
            <span className="font-medium">Local Language Support:</span> Insights and advice in your preferred language.
          </p>
        </footer>
      </div>

      {/* Receipt Upload Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Upload Receipt for AI Scan"
        footer={
          <div className="flex space-x-2">
            <Button onClick={() => setIsReceiptModalOpen(false)} variant="secondary" disabled={receiptUploadLoading}>
              Close
            </Button>
            <Button onClick={processReceiptImage} disabled={!selectedReceiptFile || receiptUploadLoading}>
              {receiptUploadLoading ? 'Processing...' : 'Upload & Scan'}
            </Button>
          </div>
        }
      >
        <p className="mb-4">
          Upload an image of your receipt. Our AI will extract key details like total amount, items, and date.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {receiptUploadMessage && (
          <p className={`mt-3 text-sm ${receiptUploadLoading ? 'text-blue-600' : extractedReceiptData ? 'text-green-600' : 'text-red-600'}`}>
            {receiptUploadMessage}
          </p>
        )}

        {extractedReceiptData && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2">Extracted Data:</h5>
            {extractedReceiptData.totalAmount && <p><strong>Total:</strong> ${extractedReceiptData.totalAmount.toFixed(2)}</p>}
            {extractedReceiptData.date && <p><strong>Date:</strong> {extractedReceiptData.date}</p>}
            {extractedReceiptData.category && <p><strong>Category:</strong> {extractedReceiptData.category}</p>}
            {extractedReceiptData.warrantyInfo && <p><strong>Warranty:</strong> {extractedReceiptData.warrantyInfo}</p>}
            {extractedReceiptData.items && extractedReceiptData.items.length > 0 && (
              <>
                <p className="mt-2"><strong>Items:</strong></p>
                <ul className="list-disc list-inside text-sm pl-4">
                  {extractedReceiptData.items.map((item, index) => (
                    <li key={index}>{item.name}: ${item.price.toFixed(2)}</li>
                  ))}
                </ul>
              </>
            )}
            {Object.keys(extractedReceiptData).length === 0 && <p>No specific data extracted. Check console for raw LLM response.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
