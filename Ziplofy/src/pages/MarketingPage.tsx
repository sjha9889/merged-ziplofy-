import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useState } from "react";
import AttributionMenu from "../components/AttributionMenu";
import CampaignTrackingSection from "../components/CampaignTrackingSection";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import MarketingAppsSection from "../components/MarketingAppsSection";
import StatCard from "../components/StatCard";
import TopMarketingChannels from "../components/TopMarketingChannels";

const MarketingPage: React.FC = () => {
  const [isAttributionMenuOpen, setIsAttributionMenuOpen] = useState(false);
  const [selectedAttribution, setSelectedAttribution] = useState('Last non-direct click');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');

  const handleAttributionClick = useCallback(() => {
    setIsAttributionMenuOpen((prev) => !prev);
  }, []);

  const handleAttributionClose = useCallback(() => {
    setIsAttributionMenuOpen(false);
  }, []);

  const handleAttributionSelect = useCallback((value: string) => {
    setSelectedAttribution(value);
    setIsAttributionMenuOpen(false);
  }, []);

  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  const attributionOptions = [
    'Last non-direct click',
    'Last click',
    'First click',
    'Any click',
    'Linear'
  ];

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium text-gray-900">
                Marketing
              </h1>
              <div className="flex gap-2 items-center">
                <button
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    selectedPeriod === 'Last 30 days'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePeriodChange('Last 30 days')}
                >
                  Last 30 days
                </button>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={handleAttributionClick}
                  >
                    {selectedAttribution}
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  </button>
                  <AttributionMenu
                    isOpen={isAttributionMenuOpen}
                    options={attributionOptions}
                    selectedValue={selectedAttribution}
                    onSelect={handleAttributionSelect}
                    onClose={handleAttributionClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <StatCard title="Sessions" value="12,450" />
              <StatCard title="Sales attributed to marketing" value="$45,230" />
              <StatCard title="Orders attributed to marketing" value="342" />
              <StatCard title="Conversion rate" value="2.75%" />
              <StatCard title="AOV attributed to marketing" value="$132.15" />
            </div>

            {/* Top marketing channels */}
            <TopMarketingChannels />

            {/* Centralize your campaign tracking */}
            <CampaignTrackingSection />

            {/* Generate traffic with marketing apps */}
            <MarketingAppsSection />
          </div>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default MarketingPage;
