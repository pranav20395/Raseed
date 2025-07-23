// src/components/dashboard/SmartCart.tsx
import React, { useState } from 'react';
import { callGeminiApi } from '../../lib/geminiApi'; // Import the Gemini API utility

interface SmartCartItem {
  id: number;
  name: string;
  lastPurchase: string;
  frequency: string;
}

interface SmartCartProps {
  smartCartItems: SmartCartItem[];
}

const SmartCart: React.FC<SmartCartProps> = ({ smartCartItems }) => {
  const [surpriseMeSuggestions, setSurpriseMeSuggestions] = useState<string[]>([]);
  const [isSurpriseMeLoading, setIsSurpriseMeLoading] = useState<boolean>(false);

  // Function to generate "Surprise Me" suggestions using LLM
  const handleSurpriseMe = async (): Promise<void> => {
    setIsSurpriseMeLoading(true);
    setSurpriseMeSuggestions([]); // Clear previous suggestions

    try {
      const prompt: string = `Based on the following smart cart items, suggest 3 new, interesting, or eco-friendly product ideas. Format as a comma-separated list. Smart Cart Items: ${smartCartItems.map(item => item.name).join(', ')}.`;
      const text: string | null = await callGeminiApi(prompt); // Use the utility function

      if (text) {
        // Assuming the LLM returns a comma-separated list
        setSurpriseMeSuggestions(text.split(',').map(item => item.trim()));
      } else {
        setSurpriseMeSuggestions(['No new suggestions at the moment.']);
      }
    } catch (error) {
      console.error('Error calling Gemini API for surprise me:', error);
      setSurpriseMeSuggestions(['Failed to get suggestions.']);
    } finally {
      setIsSurpriseMeLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Smart Cart</h2>
      <p className="text-gray-600 mb-4">
        Detects repeat purchases and suggests smart shopping lists.
      </p>
      <ul className="space-y-3">
        {smartCartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-green-50 p-3 rounded-md shadow-sm">
            <div>
              <h3 className="font-medium text-green-800">{item.name}</h3>
              <p className="text-sm text-gray-600">Last purchased: {item.lastPurchase}</p>
            </div>
            <span className="text-xs text-green-600">{item.frequency}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSurpriseMe}
        className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSurpriseMeLoading}
      >
        "Surprise Me" (New Picks!) ✨
      </button>
      {isSurpriseMeLoading && (
        <p className="text-center text-sm text-gray-500 mt-2">Generating suggestions...</p>
      )}
      {surpriseMeSuggestions.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md shadow-sm">
          <h4 className="font-medium text-blue-800 mb-2">Suggestions for you:</h4>
          <ul className="list-disc list-inside text-sm text-blue-700">
            {surpriseMeSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartCart;
