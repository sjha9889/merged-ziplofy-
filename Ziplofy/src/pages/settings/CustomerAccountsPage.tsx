import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerAccountsManagementCard from '../../components/CustomerAccountsManagementCard';
import SignInLinksCard from '../../components/SignInLinksCard';
import TurnOffSelfServeReturnsModal from '../../components/TurnOffSelfServeReturnsModal';
import { useCustomerAccountSettings } from '../../contexts/customer-account-settings.context';
import { useStore } from '../../contexts/store.context';

const CustomerAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId, stores } = useStore();
  const {
    settings,
    loading,
    error,
    fetchByStoreId,
    update,
  } = useCustomerAccountSettings();
  const [showSignInLinks, setShowSignInLinks] = useState(false);
  const [accountVersion, setAccountVersion] = useState<'recommended' | 'legacy'>('recommended');
  const [selfServeReturns, setSelfServeReturns] = useState(false);
  const [storeCredit, setStoreCredit] = useState(false);
  const [turnOffReturnsModalOpen, setTurnOffReturnsModalOpen] = useState(false);
  const [pendingReturnsValue, setPendingReturnsValue] = useState(false);
  const [accountUrl, setAccountUrl] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeStore = useMemo(
    () => stores.find((store) => store._id === activeStoreId) || null,
    [stores, activeStoreId],
  );

  useEffect(() => {
    if (activeStoreId) {
      fetchByStoreId(activeStoreId).catch(() => {
        // errors handled via context state
      });
    }
  }, [activeStoreId, fetchByStoreId]);

  useEffect(() => {
    if (!settings) {
      setAccountUrl('');
      return;
    }
    setShowSignInLinks(Boolean(settings.showSignInLinks));
    setAccountVersion(settings.accountVersion);
    setSelfServeReturns(Boolean(settings.selfServeReturns));
    setStoreCredit(Boolean(settings.storeCredit));

    const slug =
      activeStore?.storeName
        ? activeStore.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : 'store';
    const fallbackUrl = `https://ziplofy.com/${slug}/account`;
    setAccountUrl(settings.customAccountUrl || fallbackUrl);
  }, [settings, activeStore]);

  useEffect(() => {
    if (!settings) {
      setHasUnsavedChanges(false);
      return;
    }
    const dirty =
      showSignInLinks !== settings.showSignInLinks ||
      accountVersion !== settings.accountVersion ||
      selfServeReturns !== settings.selfServeReturns ||
      storeCredit !== settings.storeCredit;
    setHasUnsavedChanges(dirty);
  }, [settings, showSignInLinks, accountVersion, selfServeReturns, storeCredit]);

  const isControlsDisabled = loading || !settings || saving;

  const handleSave = useCallback(async () => {
    if (!settings?._id) return;
    try {
      setSaving(true);
      await update(settings._id, {
        showSignInLinks,
        accountVersion,
        selfServeReturns,
        storeCredit,
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      // errors handled in context
    } finally {
      setSaving(false);
    }
  }, [settings, showSignInLinks, accountVersion, selfServeReturns, storeCredit, update]);

  const handleShowSignInLinksChange = useCallback((checked: boolean) => {
    setShowSignInLinks(checked);
  }, []);

  const handleAccountVersionChange = useCallback((value: 'recommended' | 'legacy') => {
    setAccountVersion(value);
  }, []);

  const handleSelfServeReturnsChange = useCallback((checked: boolean) => {
    if (selfServeReturns && !checked) {
      // Trying to turn off - show confirmation modal
      setPendingReturnsValue(checked);
      setTurnOffReturnsModalOpen(true);
    } else {
      // Turning on - no confirmation needed
      setSelfServeReturns(checked);
    }
  }, [selfServeReturns]);

  const handleStoreCreditChange = useCallback((checked: boolean) => {
    setStoreCredit(checked);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTurnOffReturnsModalOpen(false);
  }, []);

  const handleConfirmTurnOff = useCallback(() => {
    setSelfServeReturns(pendingReturnsValue);
    setTurnOffReturnsModalOpen(false);
  }, [pendingReturnsValue]);

  const handleNavigateToAuthentication = useCallback(() => {
    navigate('/settings/customer-accounts/authentication');
  }, [navigate]);

  const handleNavigateToDomains = useCallback(() => {
    navigate('/settings/domains');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer accounts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure sign-in options, authentication, and account features.
            </p>
          </div>
          {settings && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isControlsDisabled}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          )}
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50/80 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
        {/* Sign-in links */}
        <SignInLinksCard
          showSignInLinks={showSignInLinks}
          onShowSignInLinksChange={handleShowSignInLinksChange}
          accountVersion={accountVersion}
          onAccountVersionChange={handleAccountVersionChange}
          isControlsDisabled={isControlsDisabled}
        />

        {/* Customer accounts management */}
        <CustomerAccountsManagementCard
          accountUrl={accountUrl}
          onNavigateToAuthentication={handleNavigateToAuthentication}
          onNavigateToDomains={handleNavigateToDomains}
          selfServeReturns={selfServeReturns}
          onSelfServeReturnsChange={handleSelfServeReturnsChange}
          storeCredit={storeCredit}
          onStoreCreditChange={handleStoreCreditChange}
          isControlsDisabled={isControlsDisabled}
        />
      </div>

      {/* Turn off self-serve returns confirmation modal */}
      <TurnOffSelfServeReturnsModal
        open={turnOffReturnsModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmTurnOff}
      />
      </div>
    </div>
  );
};

export default CustomerAccountsPage;
