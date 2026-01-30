import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const DraftsPage: React.FC = () => {
  const handleMoreActions = useCallback(() => {
    // TODO: Implement more actions dropdown
    console.log('More actions clicked');
  }, []);

  const handleCreateDraftOrder = useCallback(() => {
    // TODO: Navigate to create draft order page
    // e.g., navigate("/orders/drafts/new")
    console.log('Create draft order clicked');
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="max-w-7xl mx-auto pt-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-600" />
              <h1 className="text-xl font-medium text-gray-900">Drafts</h1>
            </div>

            <button
              onClick={handleMoreActions}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              More actions
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Main white area */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
            <div className="flex flex-col items-center justify-center text-center min-h-[280px]">
              {/* Illustration */}
              <div className="relative w-[200px] h-[150px] mb-6">
                {/* soft circular base */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[180px] h-[90px] bg-blue-50 rounded-[100px/50px]" />
                {/* stacked documents */}
                <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 -rotate-[4deg] w-[120px] h-[90px] bg-gray-50 rounded-lg" />
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[140px] h-[105px] p-2 bg-white rounded-lg border border-gray-200">
                  {/* header row */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-[18px] h-[18px] bg-green-500 rounded" />
                    <div className="flex-1 h-2 bg-slate-100 rounded" />
                  </div>
                  {/* lines */}
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 bg-blue-50 rounded" />
                    <div className="h-1.5 bg-blue-50 rounded w-[85%]" />
                    <div className="h-1.5 bg-blue-50 rounded w-[70%]" />
                  </div>
                </div>
              </div>

              <h2 className="text-base font-medium mb-1.5">Manually create orders and invoices</h2>

              <p className="text-sm text-gray-600 max-w-[600px] mb-6 px-2">
                Use draft orders to take orders over the phone, email invoices to customers,
                and collect payments.
              </p>

              <button
                onClick={handleCreateDraftOrder}
                className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Create draft order
              </button>
            </div>
          </div>

          {/* Learn more */}
          <div className="text-center py-3">
            <p className="text-sm text-gray-600">
              Learn more about{' '}
              <a href="#" className="text-gray-700 underline hover:text-gray-900">
                creating draft orders
              </a>
            </p>
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default DraftsPage;
