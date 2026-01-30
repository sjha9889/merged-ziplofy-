import React from "react";
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import DashboardContent from '../components/DashboardContent';

const AnalyticsPage: React.FC = () => {
  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl font-medium text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">View your store's analytics and performance metrics</p>
          </div>
          <DashboardContent />
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default AnalyticsPage;
