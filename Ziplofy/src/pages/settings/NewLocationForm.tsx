import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FulfillmentSection from '../../components/FulfillmentSection';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
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
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">Add Location</h1>
          </div>
          <button
            onClick={handleAdd}
            className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Add
          </button>
        </div>

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
    </GridBackgroundWrapper>
  );
};

export default NewLocationForm;
