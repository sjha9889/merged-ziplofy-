import React from 'react';

interface PaidAppSubscriptionsSectionProps {
  installedCount?: number;
  onBrowseApps?: () => void;
}

const PaidAppSubscriptionsSection: React.FC<PaidAppSubscriptionsSectionProps> = ({
  installedCount = 0,
  onBrowseApps,
}) => {
  return (
    <div className="border border-gray-200 p-3 bg-gray-50">
      <h2 className="text-base font-medium text-gray-900">
        Paid app subscriptions ({installedCount} installed)
      </h2>
      <div className="mt-3 border border-gray-200 p-4 text-center bg-white">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          You don't have any paid app subscriptions
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          After you install an app that has recurring and/or usage charges, it will be shown here.
        </p>
        <button
          onClick={onBrowseApps}
          className="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Browse apps
        </button>
      </div>
    </div>
  );
};

export default PaidAppSubscriptionsSection;

