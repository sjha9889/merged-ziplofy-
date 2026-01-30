import { CubeIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ReturnProductsCardProps {
  returnProducts?: number;
  percentageChange?: number;
  lastMonth?: number;
  minWidth?: number;
}

const ReturnProductsCard: React.FC<ReturnProductsCardProps> = ({
  returnProducts = 72,
  percentageChange = 6.0,
  lastMonth = 60,
  minWidth,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-900 font-medium text-base">Return Products</h3>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <CubeIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-semibold text-gray-900">{returnProducts.toLocaleString()}</span>
        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          <span className="font-medium">{percentageChange}%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Last month:</span>
        <span className="text-gray-900 font-medium">{lastMonth.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ReturnProductsCard;

