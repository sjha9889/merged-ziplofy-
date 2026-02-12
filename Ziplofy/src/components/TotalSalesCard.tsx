import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface TotalSalesCardProps {
  totalSales?: number;
  percentageChange?: number;
  lastMonth?: number;
}

const TotalSalesCard: React.FC<TotalSalesCardProps> = ({
  totalSales = 2500,
  percentageChange = 4.9,
  lastMonth = 2345,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalSales.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              +{percentageChange}%
            </span>
            <span className="text-xs text-gray-500">vs last month ({lastMonth.toLocaleString()})</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default TotalSalesCard;
