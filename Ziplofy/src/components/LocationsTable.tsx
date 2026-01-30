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
      <div className="flex justify-between py-2 px-0 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700">Location</p>
        <p className="text-sm font-medium text-gray-700">Status</p>
      </div>
      <LocationsList
        locations={locations}
        defaultLocationId={defaultLocationId}
        onLocationClick={onLocationClick}
      />
    </>
  );
};

export default LocationsTable;

