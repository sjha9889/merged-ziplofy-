import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface GiftCardDetailHeaderProps {
  onBack: () => void;
  onDeactivate: () => void;
  isActive: boolean;
}

const GiftCardDetailHeader: React.FC<GiftCardDetailHeaderProps> = ({
  onBack,
  onDeactivate,
  isActive
}) => {
  return (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-gray-900">Gift Card Details</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage and view gift card information</p>
          </div>
        </div>
        <button
          onClick={onDeactivate}
          disabled={!isActive}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-4 h-4" />
          Deactivate
        </button>
      </div>
    </div>
  );
};

export default GiftCardDetailHeader;

