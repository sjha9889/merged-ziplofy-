import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelTrialModal from '../../components/CancelTrialModal';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import PlanDetailsSection from '../../components/PlanDetailsSection';
import SubscriptionsSection from '../../components/SubscriptionsSection';

const PlanSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleOpenCancelDialog = useCallback(() => {
    setCancelDialogOpen(true);
    setAcknowledged(false);
  }, []);

  const handleCloseCancelDialog = useCallback(() => {
    setCancelDialogOpen(false);
  }, []);

  const handleAcknowledgedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAcknowledged(event.target.checked);
  }, []);

  const handleNavigateToSelectPlan = useCallback(() => {
    navigate('/settings/subscribe/select-plan');
  }, [navigate]);

  const handleNavigateToSubscriptions = useCallback(() => {
    navigate('/settings/plan/subscriptions');
  }, [navigate]);


  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-xl font-medium text-gray-900 mb-4">
          Plan
        </h1>

      <PlanDetailsSection
        onCancelTrial={handleOpenCancelDialog}
        onChoosePlan={handleNavigateToSelectPlan}
      />

      <SubscriptionsSection onViewAllSubscriptions={handleNavigateToSubscriptions} />

      <CancelTrialModal
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        acknowledged={acknowledged}
        onAcknowledgedChange={handleAcknowledgedChange}
      />
      </div>
    </GridBackgroundWrapper>
  );
};

export default PlanSettingsPage;

