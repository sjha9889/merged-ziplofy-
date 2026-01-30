import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddPaymentModal from '../../components/AddPaymentModal';
import BillingAddressCurrencySection from '../../components/BillingAddressCurrencySection';
import BillingPaymentMethodsSection from '../../components/BillingPaymentMethodsSection';
import BillingProfilePageHeader from '../../components/BillingProfilePageHeader';
import BillingTaxIdSection from '../../components/BillingTaxIdSection';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import GstModal from '../../components/GstModal';

const BillingProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('Credit card');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Andaman and Nicobar Islands');
  const [consent, setConsent] = useState(false);
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [gstin, setGstin] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showAddPaymentModal') === 'true') {
      setAddPaymentOpen(true);
    }
  }, [location.search]);

  const handleBack = useCallback(() => {
    navigate('/settings/billing');
  }, [navigate]);

  const handleOpenAddPayment = useCallback(() => {
    setAddPaymentOpen(true);
  }, []);

  const handleCloseAddPayment = useCallback(() => {
    setAddPaymentOpen(false);
  }, []);

  const handlePaymentTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(event.target.value);
  }, []);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  }, []);

  const handleStateChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setState(event.target.value);
  }, []);

  const handleConsentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.checked);
  }, []);

  const handleOpenGstModal = useCallback(() => {
    setGstModalOpen(true);
  }, []);

  const handleCloseGstModal = useCallback(() => {
    setGstModalOpen(false);
  }, []);

  const handleGstinChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGstin(event.target.value);
  }, []);

  const handleManageClick = useCallback(
    (managePath?: string) => {
      if (managePath) {
        navigate(managePath);
      }
    },
    [navigate]
  );

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <BillingProfilePageHeader onBack={handleBack} />
        <p className="text-xs text-gray-600 mb-4">
          Your payment methods, tax ID, billing currency and store address
        </p>

        <BillingPaymentMethodsSection onAddPayment={handleOpenAddPayment} />

        <BillingTaxIdSection onAddGstin={handleOpenGstModal} />

        <BillingAddressCurrencySection onManage={handleManageClick} />

        <AddPaymentModal
          open={addPaymentOpen}
          onClose={handleCloseAddPayment}
          paymentType={paymentType}
          onPaymentTypeChange={handlePaymentTypeChange}
          country={country}
          onCountryChange={handleCountryChange}
          state={state}
          onStateChange={handleStateChange}
          consent={consent}
          onConsentChange={handleConsentChange}
        />

        <GstModal
          open={gstModalOpen}
          onClose={handleCloseGstModal}
          gstin={gstin}
          onGstinChange={handleGstinChange}
        />
      </div>
    </GridBackgroundWrapper>
  );
};

export default BillingProfilePage;
