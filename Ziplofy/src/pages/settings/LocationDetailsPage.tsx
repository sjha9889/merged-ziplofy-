import React, { useCallback } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useLocations } from '../../contexts/location.context';
import { useStore } from '../../contexts/store.context';

const LocationDetailsPage: React.FC = () => {
  const { locations, updateLocation } = useLocations();
  const { activeStoreId, stores } = useStore();
  const loc = useLocation();
  const navigate = useNavigate();
  const [fulfillmentEnabled, setFulfillmentEnabled] = React.useState<boolean>(false);
  const [canShip, setCanShip] = React.useState<boolean>(false);
  const [canLocalDeliver, setCanLocalDeliver] = React.useState<boolean>(false);
  const [canPickup, setCanPickup] = React.useState<boolean>(false);
  const locationId = loc.pathname.split('/').pop();
  const location = locations.find(l => l._id === locationId);
  const isDefaultLoc = React.useMemo(() => {
    const currentStore = stores.find(s => s._id === activeStoreId);
    return currentStore?.defaultLocation === location?._id;
  }, [stores, activeStoreId, location]);

  React.useEffect(() => {
    if (location) {
      setFulfillmentEnabled(isDefaultLoc ? true : location.isFulfillmentAllowed);
      setCanShip(location.canShip);
      setCanLocalDeliver(location.canLocalDeliver);
      setCanPickup(location.canPickup);
    }
  }, [location, isDefaultLoc]);

  const handleBack = useCallback(() => {
    navigate('/settings/locations');
  }, [navigate]);

  const handleFulfillmentToggle = useCallback(
    async (checked: boolean) => {
      const value = checked;
      setFulfillmentEnabled(value);
      try {
        if (!location) return;
        if (!value) {
          setCanShip(false);
          setCanLocalDeliver(false);
          setCanPickup(false);
          await updateLocation(location._id, {
            isFulfillmentAllowed: false,
            canShip: false,
            canLocalDeliver: false,
            canPickup: false,
          });
        } else {
          await updateLocation(location._id, { isFulfillmentAllowed: true });
        }
      } catch {
        setFulfillmentEnabled((prev) => !prev);
      }
    },
    [location, updateLocation]
  );

  const handleCanShipChange = useCallback(
    async (checked: boolean) => {
      const v = checked;
      setCanShip(v);
      try {
        await updateLocation(location!._id, { canShip: v });
      } catch {
        setCanShip((prev) => !prev);
      }
    },
    [location, updateLocation]
  );

  const handleCanLocalDeliverChange = useCallback(
    async (checked: boolean) => {
      const v = checked;
      setCanLocalDeliver(v);
      try {
        await updateLocation(location!._id, { canLocalDeliver: v });
      } catch {
        setCanLocalDeliver((prev) => !prev);
      }
    },
    [location, updateLocation]
  );

  const handleCanPickupChange = useCallback(
    async (checked: boolean) => {
      const v = checked;
      setCanPickup(v);
      try {
        await updateLocation(location!._id, { canPickup: v });
      } catch {
        setCanPickup((prev) => !prev);
      }
    },
    [location, updateLocation]
  );

  if (!location) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h3 className="text-sm font-medium text-gray-900">Location not found</h3>
          <button
            onClick={handleBack}
            className="mt-3 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      </GridBackgroundWrapper>
    );
  }

  const addressLine = [
    location.address,
    location.apartment,
    location.city,
    location.state,
    location.postalCode,
    location.countryRegion,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">Location</h1>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-medium ${
              location.isActive ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {location.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Location Info Section */}
        <div className="bg-white/95 p-3 border border-gray-200 mb-3">
          <h2 className="text-sm font-medium text-gray-900 mb-1">{location.name}</h2>
          <p className="text-xs text-gray-500">{addressLine}</p>
        </div>

        {/* Fulfillment Section */}
        <div className="bg-white/95 p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Fulfillment</h3>
            <ToggleSwitch
              checked={fulfillmentEnabled}
              onChange={handleFulfillmentToggle}
              disabled={isDefaultLoc}
              label={isDefaultLoc ? 'Enable (Default location locked)' : 'Enable'}
            />
          </div>
          {isDefaultLoc && (
            <p className="text-xs text-gray-500 mb-3 block">
              This is your default location. To change whether you fulfill online orders from this
              location, select another default location first.
            </p>
          )}
          {(isDefaultLoc || fulfillmentEnabled) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <ToggleSwitch
                  checked={canShip}
                  onChange={handleCanShipChange}
                  label="Allow Shipping"
                />
              </div>
              <div>
                <ToggleSwitch
                  checked={canLocalDeliver}
                  onChange={handleCanLocalDeliverChange}
                  label="Allow Local Delivery"
                />
              </div>
              <div>
                <ToggleSwitch
                  checked={canPickup}
                  onChange={handleCanPickupChange}
                  label="Allow Pickup In-Store"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default LocationDetailsPage;


