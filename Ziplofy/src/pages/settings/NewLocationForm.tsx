import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FulfillmentSection from '../../components/FulfillmentSection';
import LocationFormFields from '../../components/LocationFormFields';
import { useLocations } from '../../contexts/location.context';
import { useStore } from '../../contexts/store.context';

const NewLocationForm: React.FC = () => {
  const navigate = useNavigate();
  const { createLocation } = useLocations();
  const { activeStoreId } = useStore();
  const [fulfillmentEnabled, setFulfillmentEnabled] = useState(false);
  const [form, setForm] = useState({
    name: '',
    countryRegion: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    canShip: false,
    canLocalDeliver: false,
    canPickup: false,
  });

  const handleChange = useCallback((k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  }, []);

  const handleAdd = useCallback(async () => {
    if (!activeStoreId) {
      navigate('/settings/locations');
      return;
    }
    await createLocation({
      storeId: activeStoreId,
      name: form.name,
      countryRegion: form.countryRegion,
      address: form.address,
      apartment: form.apartment || undefined,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      phone: form.phone,
      canShip: fulfillmentEnabled ? form.canShip : false,
      canLocalDeliver: fulfillmentEnabled ? form.canLocalDeliver : false,
      canPickup: fulfillmentEnabled ? form.canPickup : false,
      isDefault: false,
      isFulfillmentAllowed: fulfillmentEnabled,
      isActive: true,
    } as any);
    navigate('/settings/locations');
  }, [activeStoreId, form, fulfillmentEnabled, createLocation, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/settings/locations');
  }, [navigate]);

  const handleFulfillmentToggle = useCallback((checked: boolean) => {
    setFulfillmentEnabled(checked);
  }, []);

  const handleFulfillmentOptionChange = useCallback(
    (field: string, checked: boolean) => {
      handleChange(field, checked);
    },
    [handleChange]
  );

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
              aria-label="Back to locations"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add location</h1>
              <p className="mt-1 text-sm text-gray-500">
                Add a new store location with address and fulfillment options.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add location
            </button>
          </div>
        </header>

        <LocationFormFields form={form} onChange={handleChange} />
        <FulfillmentSection
          fulfillmentEnabled={fulfillmentEnabled}
          canShip={form.canShip}
          canLocalDeliver={form.canLocalDeliver}
          canPickup={form.canPickup}
          onFulfillmentToggle={handleFulfillmentToggle}
          onCanShipChange={(checked) => handleFulfillmentOptionChange('canShip', checked)}
          onCanLocalDeliverChange={(checked) => handleFulfillmentOptionChange('canLocalDeliver', checked)}
          onCanPickupChange={(checked) => handleFulfillmentOptionChange('canPickup', checked)}
        />
      </div>
    </div>
  );
};

export default NewLocationForm;
