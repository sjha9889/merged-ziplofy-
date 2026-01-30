import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLocationRow from '../../components/DefaultLocationRow';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
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
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-xl font-medium text-gray-900 mb-3 border-b border-gray-200 pb-3">
          Locations
        </h1>

        <div className="border border-gray-200 bg-white/95 p-3 mb-3">
          <h2 className="text-sm font-medium mb-1.5 text-gray-900">Default Location</h2>
          <p className="text-xs text-gray-600 mb-3">
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
            <p className="text-xs text-gray-600">No default location set.</p>
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
    </GridBackgroundWrapper>
  );
};


export default LocationsSettings;
