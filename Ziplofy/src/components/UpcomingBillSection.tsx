import React, { useCallback } from 'react';

interface UpcomingBillSectionProps {
  onViewBill: () => void;
  onAddPayment: () => void;
  handleVisitPlanSettings: () => void
}

const UpcomingBillSection: React.FC<UpcomingBillSectionProps> = ({
  onViewBill,
  onAddPayment,
  handleVisitPlanSettings
}) => {
  const handleViewBill = useCallback(() => {
    onViewBill();
  }, [onViewBill]);

  const handleAddPayment = useCallback(() => {
    onAddPayment();
  }, [onAddPayment]);

  return (
    <div className="border border-gray-200 bg-white/95 mb-4">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Upcoming bill
          </h3>
          <div className="text-2xl font-medium text-gray-900">
            ₹0.00 <span className="text-base">INR</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Next bill will be charged today
          </p>
        </div>
        <button
          className="cursor-pointer text-sm text-gray-700 hover:underline"
          onClick={handleViewBill}
        >
          View bill
        </button>
      </div>
      <div className="p-4 border-b border-gray-200">
        <button
          className="w-full px-3 py-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          onClick={handleAddPayment}
        >
          + Add payment method
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-600">
          To make changes to your plan,{' '}
          <span onClick={handleVisitPlanSettings} className="text-gray-700 cursor-pointer hover:underline">
            visit plan settings
          </span>
        </p>
      </div>
    </div>
  );
};

export default UpcomingBillSection;

