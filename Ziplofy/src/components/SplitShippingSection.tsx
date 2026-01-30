import React from 'react';

interface SplitShippingSectionProps {
  splitShipping: boolean;
  onToggle: () => void;
  onManage: () => void;
}

const SplitShippingSection: React.FC<SplitShippingSectionProps> = ({
  splitShipping,
  onToggle,
  onManage,
}) => {
  return (
    <div className="mt-4 border border-gray-200 bg-white/95 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Split shipping</h3>
          <p className="text-xs text-gray-600 mt-1">
            Show products from different profiles or locations as separate shipments in checkout.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`px-2 py-1 text-xs font-medium transition-colors border border-gray-200 ${
              splitShipping
                ? 'bg-gray-100 text-gray-900'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {splitShipping ? 'On' : 'Off'}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onManage();
            }}
            className="text-gray-700 hover:text-gray-900 text-xs transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitShippingSection;

