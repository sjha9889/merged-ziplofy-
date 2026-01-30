import React, { useCallback } from 'react';

interface LocationRowProps {
  location: {
    _id: string;
    name: string;
    address?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    countryRegion?: string;
    isActive: boolean;
  };
  isDefault: boolean;
  onLocationClick: (locationId: string) => void;
}

const LocationRow: React.FC<LocationRowProps> = ({ location, isDefault, onLocationClick }) => {
  const handleClick = useCallback(() => {
    onLocationClick(location._id);
  }, [location._id, onLocationClick]);

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
    <div
      onClick={handleClick}
      className="flex justify-between items-center py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors last:border-b-0"
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{location.name}</p>
          {isDefault && (
            <span className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100">
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">{addressLine}</p>
      </div>
      <span
        className={`px-2 py-0.5 text-xs font-medium ${
          location.isActive 
            ? 'bg-gray-100 text-gray-700' 
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {location.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default LocationRow;

