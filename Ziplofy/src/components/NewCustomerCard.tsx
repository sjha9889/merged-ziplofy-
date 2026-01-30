import { UserGroupIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface NewCustomerCardProps {
  newCustomers?: number;
  percentageChange?: number;
  lastMonth?: number;
  minWidth?: number;
}

const NewCustomerCard: React.FC<NewCustomerCardProps> = ({
  newCustomers = 110,
  percentageChange = 7.5,
  lastMonth = 89,
  minWidth,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-900 font-medium text-base">New Customer</h3>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <UserGroupIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-semibold text-gray-900">{newCustomers.toLocaleString()}</span>
        <div className="flex items-center gap-1 bg-pink-50 text-pink-700 px-2 py-1 rounded text-xs">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
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

export default NewCustomerCard;

