import React, { useCallback } from 'react';

interface BillingPaymentMethodsSectionProps {
  onAddPayment: () => void;
}

const BillingPaymentMethodsSection: React.FC<BillingPaymentMethodsSectionProps> = ({ onAddPayment }) => {
  const handleAddPayment = useCallback(() => {
    onAddPayment();
  }, [onAddPayment]);

  return (
    <div className="border border-gray-200 bg-white/95 mb-4 p-4">
      <h2 className="text-sm font-medium text-gray-900 mb-1">
        Payment methods
      </h2>
      <p className="text-xs text-gray-600 mb-3">
        For purchases and bills in Ziplofy
      </p>
      <button
        onClick={handleAddPayment}
        className="w-full px-3 py-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-start"
      >
        + Add payment method
      </button>
    </div>
  );
};

export default BillingPaymentMethodsSection;

