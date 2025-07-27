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
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/dashboard/PersonalFinanceAdvisor.tsx
const react_1 = __importStar(require("react"));
const geminiApi_1 = require("../../lib/geminiApi"); // Import the Gemini API utility
const PersonalFinanceAdvisor = ({ spendingData, savingsGoals }) => {
    const [advisorChat, setAdvisorChat] = (0, react_1.useState)([
        { role: 'advisor', text: 'Hello! How can I help you manage your finances today?' },
    ]);
    const [chatInput, setChatInput] = (0, react_1.useState)('');
    const [isAdvisorLoading, setIsAdvisorLoading] = (0, react_1.useState)(false);
    // Function to send a message to the Personal Finance Advisor (LLM-powered)
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const userMessage = chatInput.trim();
            const newChat = [...advisorChat, { role: 'user', text: userMessage }];
            setAdvisorChat(newChat);
            setChatInput('');
            setIsAdvisorLoading(true);
            try {
                const prompt = `You are a helpful financial advisor. Provide concise and actionable advice based on the user's query. User: "${userMessage}". Current spending data: ${JSON.stringify(spendingData)}. Savings goals: ${JSON.stringify(savingsGoals)}.`;
                const text = await (0, geminiApi_1.callGeminiApi)(prompt); // Use the utility function
                if (text) {
                    setAdvisorChat((prev) => [...prev, { role: 'advisor', text: text }]);
                }
                else {
                    setAdvisorChat((prev) => [...prev, { role: 'advisor', text: 'Sorry, I could not get a response. Please try again.' }]);
                }
            }
            catch (error) {
                console.error('Error calling Gemini API for advisor:', error);
                setAdvisorChat((prev) => [...prev, { role: 'advisor', text: 'An error occurred while connecting to the advisor. Please try again later.' }]);
            }
            finally {
                setIsAdvisorLoading(false);
            }
        }
    };
    return (<div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-[400px]">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Personal Finance Advisor</h2>
      <div className="flex-grow overflow-y-auto border border-gray-200 rounded-md p-3 mb-4 space-y-3 bg-gray-50">
        {advisorChat.map((msg, index) => (<div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg ${msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>))}
        {isAdvisorLoading && (<div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 p-2 rounded-lg rounded-bl-none animate-pulse">
              Thinking...
            </div>
          </div>)}
      </div>
      <form onSubmit={handleChatSubmit} className="flex gap-2">
        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask me anything about your finances..." className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isAdvisorLoading}/>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isAdvisorLoading}>
          Send ✨
        </button>
      </form>
    </div>);
};
exports.default = PersonalFinanceAdvisor;
//# sourceMappingURL=PersonalFinanceAdvisor.jsx.map