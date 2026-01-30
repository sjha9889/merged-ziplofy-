import React, { useCallback } from 'react';
import BillingChargesPageHeader from '../../components/BillingChargesPageHeader';
import BillingChargesTable from '../../components/BillingChargesTable';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const BillingChargesPage: React.FC = () => {
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <BillingChargesPageHeader onBack={handleBack} />

        <div className="border border-gray-200 bg-white/95 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4 border-b border-gray-200 pb-4">
            <div className="flex flex-row gap-2 flex-wrap">
              {['Date', 'Bill number', 'Charge type'].map((filter) => (
                <span
                  key={filter}
                  className="px-2 py-1 border border-gray-200 text-xs font-medium text-gray-700"
                >
                  {filter}
                </span>
              ))}
            </div>
            <button
              className="cursor-pointer px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
            >
              Export
            </button>
          </div>

          <BillingChargesTable />

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Showing 1 result
            </p>
            <div className="flex flex-row gap-1">
              <button
                className="min-w-[32px] px-2 py-1 border border-gray-200 text-xs text-gray-400 cursor-not-allowed"
                disabled
              >
                ‹
              </button>
              <button
                className="min-w-[32px] px-2 py-1 border border-gray-200 text-xs text-gray-400 cursor-not-allowed"
                disabled
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default BillingChargesPage;

