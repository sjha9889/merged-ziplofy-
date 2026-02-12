import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface DiscountsPageHeaderProps {
  onExport?: () => void;
  onCreateDiscount: () => void;
}

const DiscountsPageHeader: React.FC<DiscountsPageHeaderProps> = ({
  onExport,
  onCreateDiscount,
}) => {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="pl-3 border-l-4 border-blue-500/60">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Discounts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create and manage discounts for your store</p>
      </div>
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="px-3 py-2 rounded-lg border border-gray-200/80 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            Export
          </button>
        )}
        <button
          onClick={onCreateDiscount}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Create discount
        </button>
      </div>
    </div>
  );
};

export default DiscountsPageHeader;

