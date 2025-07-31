// src/components/dashboard/WarrantyTracker.tsx
import React from 'react';

interface WarrantyItem {
  id: number;
  name: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: 'Active' | 'Expired';
}

interface WarrantyTrackerProps {
  warrantyItems: WarrantyItem[];
}

const WarrantyTracker: React.FC<WarrantyTrackerProps> = ({ warrantyItems }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Smart Warranty & Return Tracker</h2>
      <p className="text-gray-600 mb-4">
        Never miss a warranty or return deadline again.
      </p>
      <ul className="space-y-3">
        {warrantyItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-red-50 p-3 rounded-md shadow-sm">
            <div>
              <h3 className="font-medium text-red-800">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Warranty ends: {item.warrantyEndDate}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                item.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarrantyTracker;
