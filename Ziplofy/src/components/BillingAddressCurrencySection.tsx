import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';

interface BillingAddressCurrencySectionProps {
  onManage: (managePath?: string) => void;
}

const BillingAddressCurrencySection: React.FC<BillingAddressCurrencySectionProps> = ({ onManage }) => {
  const handleManageClick = useCallback(
    (managePath?: string) => {
      onManage(managePath);
    },
    [onManage]
  );

  const items = [
    { label: 'Store address', value: 'India', managePath: '/settings/general' },
    { label: 'Currency', value: 'INR (Indian Rupee)', managePath: undefined },
  ];

  return (
    <div className="border border-gray-200 bg-white/95 p-4">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-medium text-gray-900">
          Address and currency
        </h2>
        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xs text-gray-600 mb-3">
        The options for your billing currency are determined by your billing address.
      </p>
      {items.map((item) => (
        <div
          key={item.label}
          className="border border-gray-200 p-3 mb-3 flex justify-between items-center last:mb-0"
        >
          <div>
            <p className="text-xs text-gray-600">
              {item.label}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {item.value}
            </p>
          </div>
          <button
            onClick={() => handleManageClick(item.managePath)}
            className="px-3 py-1.5 border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Manage
          </button>
        </div>
      ))}
    </div>
  );
};

export default BillingAddressCurrencySection;

