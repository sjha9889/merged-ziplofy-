import React from 'react';
import LocationsTable from './LocationsTable';

interface Location {
  _id: string;
  name: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryRegion?: string;
  isActive: boolean;
}

interface LocationDetailsSectionProps {
  locations: Location[];
  defaultLocationId: string | null;
  loading: boolean;
  error: string | null;
  onAddLocation: () => void;
  onLocationClick: (locationId: string) => void;
}

const LocationDetailsSection: React.FC<LocationDetailsSectionProps> = ({
  locations,
  defaultLocationId,
  loading,
  error,
  onAddLocation,
  onLocationClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 mb-6">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Locations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage locations for fulfillment, pickup, and local delivery.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddLocation}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Add Location
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      ) : (
        <>
          <LocationsTable
            locations={locations}
            defaultLocationId={defaultLocationId}
            onLocationClick={onLocationClick}
          />
        </>
      )}
    </div>
  );
};

export default LocationDetailsSection;

