import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface DeliveryCustomizationsCardProps {
  onAddClick?: () => void;
}

const DeliveryCustomizationsCard: React.FC<DeliveryCustomizationsCardProps> = ({
  onAddClick,
}) => {
  return (
    <div className="bg-white/95 border border-gray-200 p-4 mb-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-gray-900 mb-1">Delivery customizations</h2>
        <p className="text-xs text-gray-600">
          Customizations control how delivery options appear to buyers at checkout. You can hide, reorder, and rename delivery options.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        Add delivery customization
      </button>
    </div>
  );
};

export default DeliveryCustomizationsCard;

