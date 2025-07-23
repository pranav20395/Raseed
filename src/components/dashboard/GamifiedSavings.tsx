// src/components/dashboard/GamifiedSavings.tsx
import React from 'react';

interface SavingsGoal {
  name: string;
  target: number;
  current: number;
  progress: number;
}

interface GamifiedSavingsProps {
  savingsGoals: SavingsGoal[];
  handleReceiptUpload: () => void;
}

const GamifiedSavings: React.FC<GamifiedSavingsProps> = ({ savingsGoals, handleReceiptUpload }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Gamified Savings</h2>
      <p className="text-gray-600 mb-4">
        Track your progress towards savings goals and earn badges!
      </p>
      <div className="space-y-4">
        {savingsGoals.map((goal) => (
          <div key={goal.name} className="bg-blue-50 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">{goal.name}</h3>
              <span className="text-sm text-blue-600">{goal.progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ${goal.current} / ${goal.target} saved
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="font-medium text-lg text-indigo-600 mb-3">Your Badges & Streaks:</h3>
        <div className="flex flex-wrap gap-3">
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
            💰 Savings Master
          </span>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
            🔥 30-Day Streak
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
            🎯 Goal Achiever
          </span>
        </div>
      </div>
       {/* Conceptual Receipt Upload Button */}
       <div className="mt-6">
          <button
              onClick={handleReceiptUpload}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
              Upload Receipt ✨ (AI Scan)
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
              *This feature would use Gemini for turning paper receipts into smart data!
          </p>
      </div>
    </div>
  );
};

export default GamifiedSavings;
