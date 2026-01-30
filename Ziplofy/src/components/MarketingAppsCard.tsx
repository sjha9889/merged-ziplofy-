import React from 'react';

interface MarketingAppsCardProps {
  onBrowseApps?: () => void;
}

const MarketingAppsCard: React.FC<MarketingAppsCardProps> = ({
  onBrowseApps,
}) => {
  return (
    <div className="p-4 border border-gray-200 bg-white">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-medium text-gray-900">Generate traffic with marketing apps</h2>
        <p className="text-sm text-gray-600">
          Grow your audience on social platforms, capture new leads with newsletter sign-ups, increase conversion with chat, and more.
        </p>
        <div className="mt-3">
          <button
            onClick={onBrowseApps}
            className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Browse marketing apps
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingAppsCard;

