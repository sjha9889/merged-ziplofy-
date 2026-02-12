import React from 'react';
import NewCustomerCard from './NewCustomerCard';
import ReturnProductsCard from './ReturnProductsCard';
import RevenueAnalyticsCard from './RevenueAnalyticsCard';
import TotalIncomeCard from './TotalIncomeCard';
import TotalRevenueCard from './TotalRevenueCard';
import TotalSalesCard from './TotalSalesCard';

const DashboardContent: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalSalesCard />
        <ReturnProductsCard />
        <NewCustomerCard />
        <TotalRevenueCard />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalyticsCard />
        <TotalIncomeCard />
      </div>
    </div>
  );
};

export default DashboardContent;
