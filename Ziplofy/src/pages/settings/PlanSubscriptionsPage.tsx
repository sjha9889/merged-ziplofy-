import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import PaidAppSubscriptionsSection from '../../components/PaidAppSubscriptionsSection';
import SubscriptionsOverviewSection from '../../components/SubscriptionsOverviewSection';

const PlanSubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/plan');
  }, [navigate]);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className='flex items-center gap-4 mb-4'>
          <button
            onClick={handleBack}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white text-gray-900 text-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-xl font-medium text-gray-900">
            Active subscriptions
          </h1>
        </div>

        <div className="border border-gray-200 bg-white flex flex-col gap-4 p-4">
          <SubscriptionsOverviewSection />
          <PaidAppSubscriptionsSection installedCount={0} />
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default PlanSubscriptionsPage;

