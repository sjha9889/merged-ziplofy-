import React, { useCallback } from 'react';

interface BillingUpcomingBillCardProps {
  onVisitPlanSettings: () => void;
}

const BillingUpcomingBillCard: React.FC<BillingUpcomingBillCardProps> = ({ onVisitPlanSettings }) => {
  const handleVisitPlanSettings = useCallback(() => {
    onVisitPlanSettings();
  }, [onVisitPlanSettings]);

  return (
    <div className="border border-gray-200 bg-white/95 mb-4">
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-1">
          Upcoming bill
        </h2>
        <h3 className="text-2xl font-medium text-gray-900">
          ₹0.00 <span className="text-base">INR</span>
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Next bill in 30 days or when your ~₹5,330 INR threshold is reached. You have ₹5,330
          remaining.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          To make changes to your plan,{' '}
          <span onClick={handleVisitPlanSettings} className="text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
            visit plan settings
          </span>
        </p>
      </div>
    </div>
  );
};

export default BillingUpcomingBillCard;

