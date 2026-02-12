import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface NewCustomerCardProps {
  newCustomers?: number;
  percentageChange?: number;
  lastMonth?: number;
}

const NewCustomerCard: React.FC<NewCustomerCardProps> = ({
  newCustomers = 110,
  percentageChange = 7.5,
  lastMonth = 89,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">New Customers</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{newCustomers.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              +{percentageChange}%
            </span>
            <span className="text-xs text-gray-500">vs last month ({lastMonth.toLocaleString()})</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <UserGroupIcon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default NewCustomerCard;
