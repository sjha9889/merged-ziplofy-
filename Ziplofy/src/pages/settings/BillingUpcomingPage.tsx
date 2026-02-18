import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingDetailsSection from '../../components/BillingDetailsSection';
import BillingUpcomingBillCard from '../../components/BillingUpcomingBillCard';

const BillingUpcomingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/billing');
  }, [navigate]);

  const handleViewCharges = useCallback(() => {
    navigate('/settings/billing/charges');
  }, [navigate]);

  const handleVisitPlanSettings = useCallback(() => {
    navigate('/settings/plan');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Back to billing"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upcoming bill</h1>
            <p className="mt-1 text-sm text-gray-500">
              View charges on your next bill and manage your plan.
            </p>
          </div>
        </header>

        <BillingUpcomingBillCard onVisitPlanSettings={handleVisitPlanSettings} />
        <BillingDetailsSection onViewCharges={handleViewCharges} />
      </div>
    </div>
  );
};

export default BillingUpcomingPage;

