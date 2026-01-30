import React from 'react';
import NewCustomerCard from './NewCustomerCard';
import ReturnProductsCard from './ReturnProductsCard';
import RevenueAnalyticsCard from './RevenueAnalyticsCard';
import TotalIncomeCard from './TotalIncomeCard';
import TotalRevenueCard from './TotalRevenueCard';
import TotalSalesCard from './TotalSalesCard';

const DashboardContent: React.FC = () => {
  return (
    <div className="flex gap-3 w-full">
      
      {/* left */}
      <div className='flex-1 flex flex-col gap-3'>
        <div className='flex gap-3'>
          <TotalSalesCard/>
          <ReturnProductsCard/>
        </div>

        {/* second row */}
        <div>
          <RevenueAnalyticsCard />
        </div>
      </div>

      {/* right */}
      <div className='flex-1 flex flex-col gap-3'>
        <div className='flex gap-3'>
          <NewCustomerCard/>
          <TotalRevenueCard/>
        </div>
        {/* second row */}
        <div>
          <TotalIncomeCard />
        </div>
      </div>

    </div>
  );
};

export default DashboardContent;

