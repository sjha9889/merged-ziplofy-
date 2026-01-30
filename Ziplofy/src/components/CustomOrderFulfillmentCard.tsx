import React from 'react';
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CustomOrderFulfillmentCardProps {
  onAddClick?: () => void;
}

const CustomOrderFulfillmentCard: React.FC<CustomOrderFulfillmentCardProps> = ({
  onAddClick,
}) => {
  return (
    <div className="bg-white/95 border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-medium text-gray-900">Custom order fulfillment</h2>
        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Add an email for a custom fulfillment service that fulfills orders for you
      </p>
      <button
        onClick={onAddClick}
        className="px-3 py-1.5 text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        Add fulfillment service
      </button>
    </div>
  );
};

export default CustomOrderFulfillmentCard;

