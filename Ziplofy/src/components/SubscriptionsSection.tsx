import { ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface SubscriptionsSectionProps {
  onViewAllSubscriptions: () => void;
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  onViewAllSubscriptions,
}) => {
  return (
    <div className="border border-gray-200 bg-white p-4">
      <h2 className="text-base font-medium text-gray-900">
        Subscriptions
      </h2>
      <p className="text-xs text-gray-600 mt-2 mb-3">
        Additional items you're billed for on a recurring basis
      </p>

      <div
        className="border border-gray-200 p-3 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50"
        onClick={onViewAllSubscriptions}
      >
        <p className="text-sm text-gray-900">
          View all subscriptions
        </p>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SubscriptionsSection;

