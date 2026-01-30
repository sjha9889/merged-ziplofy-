import React from 'react';
import GettingStartedCard from './GettingStartedCard';
import HelpfulResourcesCard from './HelpfulResourcesCard';
import ImproveYourStoreCard from './ImproveYourStoreCard';
import OverviewVideoCard from './OverviewVideoCard';

interface GettingStartedPageProps {
  onStepClick?: (stepId: string) => void;
  onTestOrderClick?: () => void;
  onImprovementClick?: (itemId: string) => void;
  onResourceClick?: (resourceId: string) => void;
}

const GettingStartedPage: React.FC<GettingStartedPageProps> = ({
  onStepClick,
  onTestOrderClick,
  onImprovementClick,
  onResourceClick,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Header */}
      <div className="text-center mb-2">
        <h1 className="text-xl font-semibold text-gray-900 mb-1.5">Welcome to Ziplofy</h1>
        <p className="text-sm text-gray-600">
          Let's set up your e-commerce store and manage your business effectively
        </p>
      </div>

      {/* Getting Started Card */}
      <GettingStartedCard onStepClick={onStepClick} onTestOrderClick={onTestOrderClick} />

      {/* Improve Your Store Card */}
      <ImproveYourStoreCard onItemClick={onImprovementClick} />

      {/* Video and Resources Section */}
      <div className="flex gap-3 bg-white border border-gray-200 rounded-lg p-4">
        <OverviewVideoCard />
        <HelpfulResourcesCard onResourceClick={onResourceClick} />
      </div>
    </div>
  );
};

export default GettingStartedPage;

