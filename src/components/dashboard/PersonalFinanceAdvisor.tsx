// src/components/dashboard/PersonalFinanceAdvisor.tsx
import React, { useState } from 'react';
import { callGeminiApi } from '../../lib/geminiApi'; // Import the Gemini API utility

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

interface ChatMessage {
  role: 'user' | 'advisor';
  text: string;
}

interface PersonalFinanceAdvisorProps {
  spendingData: SpendingItem[];
  savingsGoals: SavingsGoal[];
}

const PersonalFinanceAdvisor: React.FC<PersonalFinanceAdvisorProps> = ({ spendingData, savingsGoals }) => {
  const [advisorChat, setAdvisorChat] = useState<ChatMessage[]>([
    { role: 'advisor', text: 'Hello! How can I help you manage your finances today?' },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);

  // Function to send a message to the Personal Finance Advisor (LLM-powered)
  const handleChatSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (chatInput.trim()) {
      const userMessage: string = chatInput.trim();
      const newChat: ChatMessage[] = [...advisorChat, { role: 'user', text: userMessage }];
      setAdvisorChat(newChat);
      setChatInput('');
      setIsAdvisorLoading(true);

      try {
        const prompt: string = `You are a helpful financial advisor. Provide concise and actionable advice based on the user's query. User: "${userMessage}". Current spending data: ${JSON.stringify(spendingData)}. Savings goals: ${JSON.stringify(savingsGoals)}.`;
        const text: string | null = await callGeminiApi(prompt); // Use the utility function

        if (text) {
          setAdvisorChat((prev) => [...prev, { role: 'advisor', text: text }]);
        } else {
          setAdvisorChat((prev) => [...prev, { role: 'advisor', text: 'Sorry, I could not get a response. Please try again.' }]);
        }
      } catch (error) {
        console.error('Error calling Gemini API for advisor:', error);
        setAdvisorChat((prev) => [...prev, { role: 'advisor', text: 'An error occurred while connecting to the advisor. Please try again later.' }]);
      } finally {
        setIsAdvisorLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-[400px]">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Personal Finance Advisor</h2>
      <div className="flex-grow overflow-y-auto border border-gray-200 rounded-md p-3 mb-4 space-y-3 bg-gray-50">
        {advisorChat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isAdvisorLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 p-2 rounded-lg rounded-bl-none animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleChatSubmit} className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
          placeholder="Ask me anything about your finances..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isAdvisorLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAdvisorLoading}
        >
          Send ✨
        </button>
      </form>
    </div>
  );
};

export default PersonalFinanceAdvisor;
