import React from 'react';

interface MarketingAppsSectionProps {
  onBrowseApps?: () => void;
}

const MarketingAppsSection: React.FC<MarketingAppsSectionProps> = ({
  onBrowseApps,
}) => {
  return (
    <div className="p-4 border border-gray-200 bg-white">
      <h2 className="text-base font-medium mb-2 text-gray-900">Generate traffic with marketing apps</h2>
      <p className="text-sm text-gray-600 mb-3">
        Grow your audience on social platforms, capture new leads with newsletters, signups, increase conversion with chat and more.
      </p>
      <button
        onClick={onBrowseApps}
        className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        Browse marketing apps
      </button>
    </div>
  );
};

export default MarketingAppsSection;

