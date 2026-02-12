import { ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { CubeIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ReturnProductsCardProps {
  returnProducts?: number;
  percentageChange?: number;
  lastMonth?: number;
}

const ReturnProductsCard: React.FC<ReturnProductsCardProps> = ({
  returnProducts = 72,
  percentageChange = 6.0,
  lastMonth = 60,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Return Products</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{returnProducts.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-medium">
              <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
              -{percentageChange}%
            </span>
            <span className="text-xs text-gray-500">vs last month ({lastMonth.toLocaleString()})</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <CubeIcon className="w-6 h-6 text-amber-600" />
        </div>
      </div>
    </div>
  );
};

export default ReturnProductsCard;
