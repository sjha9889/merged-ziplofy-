import React from 'react';

interface AbandonedCartSummaryProps {
  totalItems: number;
  uniqueProducts: number;
  totalValue: number;
  lastUpdated: string;
  formatDate: (dateString: string) => string;
}

const AbandonedCartSummary: React.FC<AbandonedCartSummaryProps> = ({
  totalItems,
  uniqueProducts,
  totalValue,
  lastUpdated,
  formatDate,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
      </div>
      <div className="p-4">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Items</span>
            <span className="text-gray-900 font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Products</span>
            <span className="text-gray-900 font-medium">{uniqueProducts}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Total</span>
              <span className="text-blue-600 font-semibold">₹{totalValue.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Updated: {formatDate(lastUpdated)}</p>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCartSummary;

