"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// pages/index.tsx
const react_1 = __importStar(require("react"));
const Sidebar_1 = __importDefault(require("../components/layout/Sidebar"));
const Header_1 = __importDefault(require("../components/layout/Header"));
const SpendingOverview_1 = __importDefault(require("../components/dashboard/SpendingOverview"));
const GamifiedSavings_1 = __importDefault(require("../components/dashboard/GamifiedSavings"));
const PersonalFinanceAdvisor_1 = __importDefault(require("../components/dashboard/PersonalFinanceAdvisor"));
const SmartCart_1 = __importDefault(require("../components/dashboard/SmartCart"));
const WarrantyTracker_1 = __importDefault(require("../components/dashboard/WarrantyTracker"));
const Modal_1 = __importDefault(require("../components/common/Modal"));
const Button_1 = __importDefault(require("../components/common/Button"));
const geminiApi_1 = require("../lib/geminiApi"); // Import the Vision API function directly
const HomePage = () => {
    // Mock data for demonstration purposes
    const [spendingData, setSpendingData] = (0, react_1.useState)([
        { category: 'Groceries', amount: 450, color: '#EF4444', percentage: 25 },
        { category: 'Utilities', amount: 180, color: '#3B82F6', percentage: 10 },
        { category: 'Transport', amount: 120, color: '#F59E0B', percentage: 7 },
        { category: 'Dining Out', amount: 200, color: '#10B981', percentage: 11 },
        { category: 'Entertainment', amount: 90, color: '#8B5CF6', percentage: 5 },
        { category: 'Shopping', amount: 300, color: '#EC4899', percentage: 17 },
        { category: 'Rent', amount: 500, color: '#6B7280', percentage: 25 },
    ]);
    const [savingsGoals, setSavingsGoals] = (0, react_1.useState)([
        { name: 'New Gadget', target: 1000, current: 650, progress: 65 },
        { name: 'Vacation Fund', target: 2500, current: 800, progress: 32 },
        { name: 'Emergency Fund', target: 5000, current: 3500, progress: 70 },
    ]);
    const [warrantyItems, setWarrantyItems] = (0, react_1.useState)([
        { id: 1, name: 'Smart TV', purchaseDate: '2023-01-15', warrantyEndDate: '2026-01-15', status: 'Active' },
        { id: 2, name: 'Laptop', purchaseDate: '2024-03-10', warrantyEndDate: '2025-03-10', status: 'Active' },
        { id: 3, name: 'Coffee Machine', purchaseDate: '2023-09-01', warrantyEndDate: '2024-09-01', status: 'Expired' },
    ]);
    const [smartCartItems, setSmartCartItems] = (0, react_1.useState)([
        { id: 1, name: 'Organic Milk', lastPurchase: '2 weeks ago', frequency: 'Bi-weekly' },
        { id: 2, name: 'Coffee Beans', lastPurchase: '1 month ago', frequency: 'Monthly' },
        { id: 3, name: 'Laundry Detergent', lastPurchase: '3 weeks ago', frequency: 'Monthly' },
    ]);
    const [isSidebarOpen, setIsSidebarOpen] = (0, react_1.useState)(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = (0, react_1.useState)(false);
    const [selectedReceiptFile, setSelectedReceiptFile] = (0, react_1.useState)(null);
    const [receiptUploadLoading, setReceiptUploadLoading] = (0, react_1.useState)(false);
    const [receiptUploadMessage, setReceiptUploadMessage] = (0, react_1.useState)('');
    const [extractedReceiptData, setExtractedReceiptData] = (0, react_1.useState)(null);
    // Calculate total spending for the overview
    const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);
    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
    const projectedSavings = savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);
    // Function to open the receipt upload modal
    const handleReceiptUpload = () => {
        setIsReceiptModalOpen(true);
        setSelectedReceiptFile(null);
        setReceiptUploadMessage('');
        setExtractedReceiptData(null);
    };
    // Handle file selection and read as Base64
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedReceiptFile(file);
            setReceiptUploadMessage(`Selected: ${file.name}`);
        }
        else {
            setSelectedReceiptFile(null);
            setReceiptUploadMessage('');
        }
    };
    // Function to process the selected receipt image with LLM directly from client
    const processReceiptImage = async () => {
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
                const base64Data = reader.result.split(',')[1]; // Get Base64 part
                const mimeType = selectedReceiptFile.type;
                const prompt = `
          Analyze this receipt image and extract the following information in JSON format.
          If a field is not found, omit it.
          {
            "totalAmount": <number, e.g., 25.75>,
            "date": "<string, e.g., YYYY-MM-DD>",
            "items": [
              {"name": "<string>", "price": <number>},
              {"name": "<string>", "price": <number>}
            ],
            "category": "<string, e.g., Groceries, Electronics, Dining>",
            "warrantyInfo": "<string, any text indicating warranty terms or duration>"
          }
        `;
                try {
                    const llmResponseText = await (0, geminiApi_1.callGeminiVisionApi)(prompt, {
                        mimeType: mimeType,
                        data: base64Data,
                    });
                    if (llmResponseText) {
                        let extractedData = {};
                        try {
                            // Strip markdown code block delimiters before parsing
                            const cleanLlmResponseText = llmResponseText.replace(/```json\n?|\n?```/g, '').trim();
                            extractedData = JSON.parse(cleanLlmResponseText);
                            setExtractedReceiptData(extractedData);
                            setReceiptUploadMessage('Receipt processed successfully!');
                            console.log('Extracted Receipt Data:', extractedData);
                        }
                        catch (parseError) {
                            console.error('Failed to parse LLM response as JSON:', parseError);
                            setReceiptUploadMessage(`AI response was not valid JSON. Raw response: ${llmResponseText}`);
                            setExtractedReceiptData({}); // Indicate no structured data
                        }
                    }
                    else {
                        setReceiptUploadMessage('Failed to get a response from the AI.');
                    }
                }
                catch (error) {
                    console.error('Error calling Gemini Vision API:', error);
                    setReceiptUploadMessage(`Failed to process receipt: ${error instanceof Error ? error.message : String(error)}`);
                }
                finally {
                    setReceiptUploadLoading(false);
                }
            }
            else {
                setReceiptUploadMessage('Failed to read file as Base64.');
                setReceiptUploadLoading(false);
            }
        };
        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            setReceiptUploadMessage('Error reading file.');
            setReceiptUploadLoading(false);
        };
    };
    return (<div className="flex min-h-screen bg-gray-100 font-inter text-gray-800">
      {/* Sidebar Component */}
      <Sidebar_1.default isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} z-10`}>
        {/* Header Component */}
        <Header_1.default setIsSidebarOpen={setIsSidebarOpen}/>

        {/* Main Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Spending Insights & Gamified Savings */}
          <section className="lg:col-span-2 space-y-6">
            <SpendingOverview_1.default spendingData={spendingData} totalSpending={totalSpending} totalSavings={totalSavings} projectedSavings={projectedSavings}/>
            <GamifiedSavings_1.default savingsGoals={savingsGoals} handleReceiptUpload={handleReceiptUpload}/>
          </section>

          {/* Right Column - Personal Finance Advisor, Smart Cart, Warranty Tracker */}
          <section className="lg:col-span-1 space-y-6">
            <PersonalFinanceAdvisor_1.default spendingData={spendingData} savingsGoals={savingsGoals}/>
            <SmartCart_1.default smartCartItems={smartCartItems}/>
            <WarrantyTracker_1.default warrantyItems={warrantyItems}/>
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
      <Modal_1.default isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} title="Upload Receipt for AI Scan" footer={<div className="flex space-x-2">
            <Button_1.default onClick={() => setIsReceiptModalOpen(false)} variant="secondary" disabled={receiptUploadLoading}>
              Close
            </Button_1.default>
            <Button_1.default onClick={processReceiptImage} disabled={!selectedReceiptFile || receiptUploadLoading}>
              {receiptUploadLoading ? 'Processing...' : 'Upload & Scan'}
            </Button_1.default>
          </div>}>
        <p className="mb-4">
          Upload an image of your receipt. Our AI will extract key details like total amount, items, and date.
        </p>
        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"/>
        {receiptUploadMessage && (<p className={`mt-3 text-sm ${receiptUploadLoading ? 'text-blue-600' : extractedReceiptData ? 'text-green-600' : 'text-red-600'}`}>
            {receiptUploadMessage}
          </p>)}

        {extractedReceiptData && (<div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2">Extracted Data:</h5>
            {extractedReceiptData.totalAmount && <p><strong>Total:</strong> ${extractedReceiptData.totalAmount.toFixed(2)}</p>}
            {extractedReceiptData.date && <p><strong>Date:</strong> {extractedReceiptData.date}</p>}
            {extractedReceiptData.category && <p><strong>Category:</strong> {extractedReceiptData.category}</p>}
            {extractedReceiptData.warrantyInfo && <p><strong>Warranty:</strong> {extractedReceiptData.warrantyInfo}</p>}
            {extractedReceiptData.items && extractedReceiptData.items.length > 0 && (<>
                <p className="mt-2"><strong>Items:</strong></p>
                <ul className="list-disc list-inside text-sm pl-4">
                  {extractedReceiptData.items.map((item, index) => (<li key={index}>{item.name}: ${item.price.toFixed(2)}</li>))}
                </ul>
              </>)}
            {Object.keys(extractedReceiptData).length === 0 && <p>No specific data extracted. Check console for raw LLM response.</p>}
          </div>)}
      </Modal_1.default>
    </div>);
};
exports.default = HomePage;
//# sourceMappingURL=index.jsx.map