import React, { useCallback } from 'react';
import { useStore } from '../contexts/store.context';
import DefaultLocationChangeButton from './DefaultLocationChangeButton';

interface DefaultLocationRowProps {
  name: string;
  addressLine: string;
  locations: any[];
  currentStoreId: string;
  defaultLocationId: string;
}

const DefaultLocationRow: React.FC<DefaultLocationRowProps> = ({
  name,
  addressLine,
  locations,
  currentStoreId,
  defaultLocationId,
}) => {
  const { updateStore } = useStore();

  const handleSelect = useCallback(
    async (locId: string) => {
      if (locId === defaultLocationId) return;
      try {
        await updateStore(currentStoreId, { defaultLocation: locId });
      } catch (error) {
        console.error('Failed to update default location:', error);
      }
    },
    [defaultLocationId, currentStoreId, updateStore]
  );

  const otherLocations = locations.filter((l) => l._id !== defaultLocationId);

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{addressLine}</p>
      </div>
      <DefaultLocationChangeButton otherLocations={otherLocations} onSelect={handleSelect} />
    </div>
  );
};

export default DefaultLocationRow;

