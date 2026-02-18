import React from 'react';
import LocationsList from './LocationsList';

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

interface LocationsTableProps {
  locations: Location[];
  defaultLocationId: string | null;
  onLocationClick: (locationId: string) => void;
}

const LocationsTable: React.FC<LocationsTableProps> = ({
  locations,
  defaultLocationId,
  onLocationClick,
}) => {
  return (
    <>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between py-3 px-4 bg-gray-50/80 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-700">Location</p>
          <p className="text-xs font-medium text-gray-700">Status</p>
        </div>
        <div className="px-4">
          <LocationsList
            locations={locations}
            defaultLocationId={defaultLocationId}
            onLocationClick={onLocationClick}
          />
        </div>
      </div>
    </>
  );
};

export default LocationsTable;

