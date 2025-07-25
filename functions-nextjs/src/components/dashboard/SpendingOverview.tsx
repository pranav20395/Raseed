// src/components/dashboard/SpendingOverview.tsx
import React from 'react';

interface SpendingItem {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

interface SpendingOverviewProps {
  spendingData: SpendingItem[];
  totalSpending: number;
  totalSavings: number;
  projectedSavings: number;
}

const SpendingOverview: React.FC<SpendingOverviewProps> = ({ spendingData, totalSpending, totalSavings, projectedSavings }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Monthly Financial Overview</h2>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-md shadow-sm text-center">
          <p className="text-sm text-blue-600">Total Spending</p>
          <p className="text-2xl font-bold text-blue-800">${totalSpending.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-md shadow-sm text-center">
          <p className="text-sm text-green-600">Current Savings</p>
          <p className="text-2xl font-bold text-green-800">${totalSavings.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-md shadow-sm text-center">
          <p className="text-sm text-purple-600">Projected Savings Gap</p>
          <p className="text-2xl font-bold text-purple-800">${projectedSavings.toFixed(2)}</p>
        </div>
      </div>

      {/* Spending Breakdown (Mock Pie Chart / Bar Chart) */}
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">Spending by Category</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Mock Pie Chart (using SVG for basic representation) */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="#e0e0e0" />
            {/* Dynamic segments - This is a simplified visual. For real charts, use a library. */}
            {/* In a real scenario, you'd calculate stroke-dasharray for each segment */}
            {/* For demonstration, let's just show a few segments */}
            <circle
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="10"
              strokeDasharray="25 75" // 25% of circle
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
             <circle
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="#3B82F6"
              strokeWidth="10"
              strokeDasharray="10 90" // 10% of circle
              strokeDashoffset="-25" // Offset by previous segment
              transform="rotate(-90 50 50)"
            />
             <circle
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="10"
              strokeDasharray="11 89" // 11% of circle
              strokeDashoffset="-35" // Offset by previous segments
              transform="rotate(-90 50 50)"
            />
             <circle
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="#6B7280"
              strokeWidth="10"
              strokeDasharray="25 75" // 25% of circle
              strokeDashoffset="-46" // Offset by previous segments
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-indigo-700">
            {`${((totalSpending / (totalSpending + totalSavings)) * 100).toFixed(0)}%`} {/* Simplified overall spending percentage */}
          </div>
        </div>

        {/* Category List */}
        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {spendingData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md shadow-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium">{item.category}:</span>
                <span className="text-sm text-gray-600">${item.amount} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 text-right text-gray-500 text-sm">
        *Pie chart is a simplified SVG representation. For real charts, use a library like Recharts.
      </div>
    </div>
  );
};

export default SpendingOverview;
