import React from 'react';

interface DiscountsPageHeaderProps {
  onExport?: () => void;
  onCreateDiscount: () => void;
}

const DiscountsPageHeader: React.FC<DiscountsPageHeaderProps> = ({
  onExport,
  onCreateDiscount,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-medium text-gray-900">
        Discounts
      </h1>
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Export
          </button>
        )}
        <button
          onClick={onCreateDiscount}
          className="px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Create discount
        </button>
      </div>
    </div>
  );
};

export default DiscountsPageHeader;

