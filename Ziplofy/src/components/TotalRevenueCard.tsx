import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TotalRevenueCardProps {
  totalRevenue?: number;
  lastMonth?: number;
  currency?: string;
  minWidth?: number;
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  totalRevenue = 8220.64,
  lastMonth = 620.0,
  currency = '$',
  minWidth,
}) => {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-900 font-medium text-base">Total Revenue</h3>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      
      <div className="mb-3">
        <span className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Last month:</span>
        <span className="text-gray-900 font-medium">{formatCurrency(lastMonth)}</span>
      </div>
    </div>
  );
};

export default TotalRevenueCard;

