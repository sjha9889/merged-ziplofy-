import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLocationRow from '../../components/DefaultLocationRow';
import LocationDetailsSection from '../../components/LocationDetailsSection';
import { useLocations } from '../../contexts/location.context';
import { useStore } from '../../contexts/store.context';
export { LocationDetailSettings } from './LocationDetailSettings';
export { NewLocationSettings } from './NewLocationSettings';


const LocationsSettings: React.FC = () => {
  const navigate = useNavigate();
  const { fetchLocationsByStoreId, locations, loading, error } = useLocations();
  const { activeStoreId, stores } = useStore();

  React.useEffect(() => {
    if (activeStoreId) fetchLocationsByStoreId(activeStoreId);
  }, [activeStoreId, fetchLocationsByStoreId]);

  const currentStore = stores.find((s) => s._id === activeStoreId);
  const defaultLocationId = currentStore?.defaultLocation || null;
  const defLoc = defaultLocationId ? locations.find((l) => l._id === defaultLocationId) : undefined;
  const addressLine = defLoc
    ? [defLoc.address, defLoc.apartment, defLoc.city, defLoc.state, defLoc.postalCode, defLoc.countryRegion]
        .filter(Boolean)
        .join(', ')
    : '';

  const handleAddLocation = useCallback(() => {
    navigate('/settings/locations/new');
  }, [navigate]);

  const handleLocationClick = useCallback(
    (locationId: string) => {
      navigate(`/settings/locations/${locationId}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6 py-6 px-4">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Locations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage where you stock inventory, fulfill orders, and offer pickup or local delivery.
          </p>
        </header>

        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-base font-semibold mb-1 text-gray-900">Default location</h2>
          <p className="text-sm text-gray-500 mb-4">
            This location is used by Ziplofy and apps when no other location is specified.
          </p>
          {defaultLocationId && defLoc ? (
            <DefaultLocationRow
              name={defLoc.name}
              addressLine={addressLine}
              locations={locations}
              currentStoreId={currentStore!._id}
              defaultLocationId={defaultLocationId}
            />
          ) : (
            <p className="text-sm text-gray-500">No default location set.</p>
          )}
        </div>

        <LocationDetailsSection
          locations={locations}
          defaultLocationId={defaultLocationId}
          loading={loading}
          error={error}
          onAddLocation={handleAddLocation}
          onLocationClick={handleLocationClick}
        />
      </div>
    </div>
  );
};


export default LocationsSettings;
