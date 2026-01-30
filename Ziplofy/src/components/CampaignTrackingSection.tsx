import React from 'react';

interface CampaignTrackingSectionProps {
  onCreateCampaign?: () => void;
  onLearnMore?: () => void;
}

const CampaignTrackingSection: React.FC<CampaignTrackingSectionProps> = ({
  onCreateCampaign,
  onLearnMore,
}) => {
  return (
    <div className="p-4 border border-gray-200 bg-white">
      <h2 className="text-base font-medium mb-2 text-gray-900">Centralize your campaign tracking</h2>
      <p className="text-sm text-gray-600 mb-3">
        Create campaigns to evaluate how marketing initiatives drive business goals, capture online and offline touch points, add campaign activities from multiple marketing channels, and monitor results.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCreateCampaign}
          className="px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Create campaign
        </button>
        <button
          onClick={onLearnMore}
          className="px-3 py-1.5 text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default CampaignTrackingSection;

