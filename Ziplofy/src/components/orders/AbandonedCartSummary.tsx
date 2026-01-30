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
    <div className="bg-white border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Items:</span>
          <span className="text-gray-900 font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Products:</span>
          <span className="text-gray-900 font-medium">{uniqueProducts}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-900 font-medium">Total:</span>
            <span className="text-gray-900 font-semibold">${totalValue.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">Updated: {formatDate(lastUpdated)}</p>
      </div>
    </div>
  );
};

export default AbandonedCartSummary;

