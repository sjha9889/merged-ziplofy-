import React from 'react';
import LocationRow from './LocationRow';

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

interface LocationsListProps {
  locations: Location[];
  defaultLocationId: string | null;
  onLocationClick: (locationId: string) => void;
}

const LocationsList: React.FC<LocationsListProps> = ({
  locations,
  defaultLocationId,
  onLocationClick,
}) => {
  if (locations.length === 0) {
    return <p className="text-sm text-gray-500 py-3">No locations found for this store.</p>;
  }

  return (
    <div>
      {locations.map((loc) => {
        return (
          <LocationRow
            key={loc._id}
            location={loc}
            isDefault={defaultLocationId === loc._id}
            onLocationClick={onLocationClick}
          />
        );
      })}
    </div>
  );
};

export default LocationsList;

