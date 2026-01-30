import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const ShopMetafieldsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/general');
  }, [navigate]);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              Shop metafields
            </h1>
          </div>

          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
            View definitions
          </button>
        </div>

        {/* Main Content Card */}
        <div className="border border-gray-200 bg-white p-6 text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Add a custom field to your shop
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
            Create custom fields for information that applies to your entire store,
            such as global settings or configurations.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors">
            Add definition
          </button>
        </div>

        {/* Learn More Link */}
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <span>Learn more about metafields</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ShopMetafieldsPage;

