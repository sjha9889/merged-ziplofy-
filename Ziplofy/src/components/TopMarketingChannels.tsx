import React from 'react';

interface TopMarketingChannelsProps {
  message?: string;
}

const TopMarketingChannels: React.FC<TopMarketingChannelsProps> = ({
  message = "No data found for the date range selected. Please select a different period."
}) => {
  return (
    <div className="p-4 border border-gray-200 bg-white">
      <h2 className="text-base font-medium mb-2 text-gray-900">Top marketing channels</h2>
      <p className="text-sm text-gray-600">
        {message}
      </p>
    </div>
  );
};

export default TopMarketingChannels;

