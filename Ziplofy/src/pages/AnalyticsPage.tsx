import React from "react";
import DashboardContent from '../components/DashboardContent';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        <div className="mb-6 pl-3 border-l-4 border-blue-500/60">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">View your store's analytics and performance metrics</p>
        </div>
        <DashboardContent />
      </div>
    </div>
  );
};

export default AnalyticsPage;
