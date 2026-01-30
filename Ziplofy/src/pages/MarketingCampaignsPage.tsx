import React, { useCallback } from "react";
import CampaignTrackingCard from "../components/CampaignTrackingCard";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import MarketingAppsCard from "../components/MarketingAppsCard";

const MarketingCampaignsPage: React.FC = () => {
  
  const handleCreateCampaign = useCallback(() => {
    // Handle create campaign action
  }, []);

  const handleLearnMore = useCallback(() => {
    // Handle learn more action
  }, []);

  const handleBrowseApps = useCallback(() => {
    // Handle browse apps action
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium text-gray-900">Campaigns</h1>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                All
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <CampaignTrackingCard
              onCreateCampaign={handleCreateCampaign}
              onLearnMore={handleLearnMore}
            />

            {/* Card 2 */}
            <MarketingAppsCard onBrowseApps={handleBrowseApps} />
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default MarketingCampaignsPage;
