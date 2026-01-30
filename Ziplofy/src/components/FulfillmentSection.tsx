import React from 'react';
import FulfillmentOptions from './FulfillmentOptions';
import ToggleSwitch from './ToggleSwitch';

interface FulfillmentSectionProps {
  fulfillmentEnabled: boolean;
  canShip: boolean;
  canLocalDeliver: boolean;
  canPickup: boolean;
  onFulfillmentToggle: (checked: boolean) => void;
  onCanShipChange: (checked: boolean) => void;
  onCanLocalDeliverChange: (checked: boolean) => void;
  onCanPickupChange: (checked: boolean) => void;
}

const FulfillmentSection: React.FC<FulfillmentSectionProps> = ({
  fulfillmentEnabled,
  canShip,
  canLocalDeliver,
  canPickup,
  onFulfillmentToggle,
  onCanShipChange,
  onCanLocalDeliverChange,
  onCanPickupChange,
}) => {
  return (
    <div className="bg-white/95 p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Fulfillment</h3>
        <ToggleSwitch checked={fulfillmentEnabled} onChange={onFulfillmentToggle} label="Enable"/>
      </div>
      {fulfillmentEnabled && (
        <FulfillmentOptions
          canShip={canShip}
          canLocalDeliver={canLocalDeliver}
          canPickup={canPickup}
          onCanShipChange={onCanShipChange}
          onCanLocalDeliverChange={onCanLocalDeliverChange}
          onCanPickupChange={onCanPickupChange}
        />
      )}
    </div>
  );
};

export default FulfillmentSection;

