import React, { useCallback } from 'react';

interface BillingDetailsSectionProps {
  onViewCharges: () => void;
}

const BillingDetailsSection: React.FC<BillingDetailsSectionProps> = ({ onViewCharges }) => {
  const handleViewCharges = useCallback(() => {
    onViewCharges();
  }, [onViewCharges]);

  const details = [
    { label: 'Subtotal', value: '₹0.00' },
    { label: 'Running total', value: '₹0.00' },
  ];

  return (
    <div className="border border-gray-200 bg-white/95">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">
          Details
        </h2>
        <button
          className="cursor-pointer px-3 py-1.5 border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={handleViewCharges}
        >
          View in charge table
        </button>
      </div>
      {details.map((row) => (
        <div
          key={row.label}
          className="flex justify-between px-4 py-3 border-t border-gray-200"
        >
          <p className="text-sm font-medium text-gray-900">
            {row.label}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BillingDetailsSection;

