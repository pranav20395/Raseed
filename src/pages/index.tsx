// pages/index.tsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import GamifiedSavings from '../components/dashboard/GamifiedSavings';
import PersonalFinanceAdvisor from '../components/dashboard/PersonalFinanceAdvisor';
import SmartCart from '../components/dashboard/SmartCart';
import WarrantyTracker from '../components/dashboard/WarrantyTracker';
import Modal from '../components/common/Modal'; // Import the Modal component

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

const HomePage: React.FC = () => {
  // Mock data for demonstration purposes (moved here as parent state)
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

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State for sidebar toggle
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false); // State for receipt modal

  // Calculate total spending for the overview
  const totalSpending: number = spendingData.reduce((sum, item) => sum + item.amount, 0);
  const totalSavings: number = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const projectedSavings: number = savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);

  // Function to simulate receipt upload (conceptual, would involve image processing with LLM)
  const handleReceiptUpload = (): void => {
    setIsReceiptModalOpen(true); // Open the modal instead of alert
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
        title="Receipt Upload (AI Scan)"
      >
        <p>
          This feature would allow you to upload a photo of your paper receipt.
          Our AI (powered by Gemini) would then extract key information like items, prices,
          and dates, categorize your spending, and even identify warranty details!
        </p>

      </Modal>
    </div>
  );
};

export default HomePage;
