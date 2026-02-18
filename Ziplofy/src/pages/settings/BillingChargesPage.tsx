import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import BillingChargesTable from '../../components/BillingChargesTable';

const BillingChargesPage: React.FC = () => {
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Charges</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and export your billing charges by date, bill number, or type.
            </p>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
              <div className="flex flex-row gap-2 flex-wrap">
                {['Date', 'Bill number', 'Charge type'].map((filter) => (
                  <span
                    key={filter}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-gray-50/80"
                  >
                    {filter}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="rounded-lg px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Export
              </button>
            </div>

            <BillingChargesTable />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Showing 1 result</p>
              <div className="flex flex-row gap-1">
                <button
                  type="button"
                  className="min-w-[32px] h-8 px-2 rounded-lg border border-gray-200 text-sm text-gray-400 cursor-not-allowed bg-gray-50"
                  disabled
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="min-w-[32px] h-8 px-2 rounded-lg border border-gray-200 text-sm text-gray-400 cursor-not-allowed bg-gray-50"
                  disabled
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingChargesPage;

