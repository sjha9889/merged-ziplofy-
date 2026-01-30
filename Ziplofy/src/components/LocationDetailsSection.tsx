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
    <div className="border border-gray-200 bg-white/95 p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-900">Location Details</h2>
        <button
          onClick={onAddLocation}
          className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Add Location
        </button>
      </div>
      {error && (
        <div className="mb-3 p-2 bg-gray-50 border border-gray-200 text-xs text-gray-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
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

