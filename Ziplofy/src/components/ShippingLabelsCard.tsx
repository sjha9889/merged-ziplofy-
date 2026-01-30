import React from 'react';
import { CalculatorIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ShippingLabelsCardProps {
  onCalculateRatesClick: () => void;
}

const ShippingLabelsCard: React.FC<ShippingLabelsCardProps> = ({
  onCalculateRatesClick,
}) => {
  return (
    <div className="border border-gray-200 bg-white/95 p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-medium text-gray-900">Shipping labels</h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-xs text-gray-600">
            Buy labels with the lowest rates. Manage your carriers to fulfill orders faster.
          </p>
        </div>
        <button
          onClick={onCalculateRatesClick}
          className="px-3 py-1.5 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <CalculatorIcon className="w-4 h-4" />
          Calculate rates
        </button>
      </div>
    </div>
  );
};

export default ShippingLabelsCard;

