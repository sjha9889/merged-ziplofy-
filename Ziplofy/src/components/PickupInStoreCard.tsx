import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface PickupInStoreCardProps {
  onSetUpClick?: () => void;
}

const PickupInStoreCard: React.FC<PickupInStoreCardProps> = ({
  onSetUpClick,
}) => {
  return (
    <div className="bg-white/95 border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-medium text-gray-900">Pickup in store</h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-xs text-gray-600">
            Let customers pick up their orders at your locations
          </p>
        </div>
        <button
          onClick={onSetUpClick}
          className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Set up
        </button>
      </div>
    </div>
  );
};

export default PickupInStoreCard;

