import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PaidAppSubscriptionsSection from '../../components/PaidAppSubscriptionsSection';
import SubscriptionsOverviewSection from '../../components/SubscriptionsOverviewSection';

const PlanSubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/plan');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            onClick={handleBack}
            type="button"
            className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back to plan"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active subscriptions</h1>
            <p className="mt-1 text-sm text-gray-500">Manage recurring subscription items for your store.</p>
          </div>
        </header>

        <SubscriptionsOverviewSection />
        <PaidAppSubscriptionsSection installedCount={0} />
      </div>
    </div>
  );
};

export default PlanSubscriptionsPage;

