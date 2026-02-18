import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PastBillsSection from '../../components/PastBillsSection';
import UpcomingBillSection from '../../components/UpcomingBillSection';

const BillingSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToProfile = useCallback(() => {
    navigate('/settings/billing/profile');
  }, [navigate]);

  const handleNavigateToUpcoming = useCallback(() => {
    navigate('/settings/billing/upcoming');
  }, [navigate]);

  const handleNavigateToAddPayment = useCallback(() => {
    navigate('/settings/billing/profile?showAddPaymentModal=true');
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage payment methods, upcoming charges, and past bills.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNavigateToProfile}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
          >
            Billing profile
          </button>
        </header>

        <div className="rounded-xl border border-blue-200/80 bg-blue-50/80 p-4 flex items-start gap-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Ensure your billing address meets India payment requirements
            </h3>
            <p className="text-sm text-gray-600">
              Indian payment regulations require specific address formatting.{' '}
              <button type="button" className="text-blue-700 font-medium hover:underline">
                View address guidelines
              </button>{' '}
              to see the requirements, or{' '}
              <button type="button" className="text-blue-700 font-medium hover:underline">
                update your address now
              </button>
              .
            </p>
          </div>
        </div>

        <UpcomingBillSection
          onViewBill={handleNavigateToUpcoming}
          onAddPayment={handleNavigateToAddPayment}
          handleVisitPlanSettings={handleVisitPlanSettings}
        />

        <PastBillsSection onViewCharges={handleViewCharges} />
      </div>
    </div>
  );
};

export default BillingSettingsPage;

