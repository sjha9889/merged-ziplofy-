import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingDetailsSection from '../../components/BillingDetailsSection';
import BillingUpcomingBillCard from '../../components/BillingUpcomingBillCard';
import BillingUpcomingPageHeader from '../../components/BillingUpcomingPageHeader';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';

const BillingUpcomingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/settings/billing');
  }, [navigate]);

  const handleViewCharges = useCallback(() => {
    navigate('/settings/billing/charges');
  }, [navigate]);

  const handleVisitPlanSettings = useCallback(() => {
    navigate("/settings/plan");
  }, [navigate]);

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <BillingUpcomingPageHeader onBack={handleBack} />
        <BillingUpcomingBillCard onVisitPlanSettings={handleVisitPlanSettings} />
        <BillingDetailsSection onViewCharges={handleViewCharges} />
      </div>
    </GridBackgroundWrapper>
  );
};

export default BillingUpcomingPage;

