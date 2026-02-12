import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TotalRevenueCardProps {
  totalRevenue?: number;
  lastMonth?: number;
  currency?: string;
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
  totalRevenue = 8220.64,
  lastMonth = 620.0,
  currency = '$',
}) => {
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          <p className="mt-2 text-xs text-gray-500">
            Last month: {formatCurrency(lastMonth)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
