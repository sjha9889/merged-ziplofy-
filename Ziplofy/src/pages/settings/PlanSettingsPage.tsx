import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelTrialModal from '../../components/CancelTrialModal';
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
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Plan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your plan, trial, and subscriptions.
            </p>
          </div>
        </header>

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
    </div>
  );
};

export default PlanSettingsPage;

