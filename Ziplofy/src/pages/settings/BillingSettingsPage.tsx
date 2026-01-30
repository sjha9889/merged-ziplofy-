import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingHeader from '../../components/BillingHeader';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
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

  const handleVisitPlanSettings = useCallback(()=>{
    navigate("/settings/plan")
  },[])

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <BillingHeader onNavigateToProfile={handleNavigateToProfile} />

        <div className="border border-gray-200 bg-gray-50 p-3 flex items-start gap-3 mb-4">
          <InformationCircleIcon className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Ensure your billing address meets India payment requirements
            </h3>
            <p className="text-xs text-gray-600">
              Indian payment regulations require specific address formatting.{' '}
              <span className="text-gray-700 cursor-pointer hover:underline">
                View address guidelines
              </span>{' '}
              to see the requirements, or{' '}
              <span className="text-gray-700 cursor-pointer hover:underline">
                click here
              </span>{' '}
              to update your address now.
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
    </GridBackgroundWrapper>
  );
};

export default BillingSettingsPage;

