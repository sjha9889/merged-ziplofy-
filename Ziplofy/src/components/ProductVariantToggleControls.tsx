import React from 'react';

interface ProductVariantToggleControlsProps {
  isPhysicalProduct: boolean;
  isInventoryTrackingEnabled: boolean;
  onIsPhysicalProductChange: (value: boolean) => void;
  onIsInventoryTrackingEnabledChange: (value: boolean) => void;
  onSaveChanges: () => void;
}

const ProductVariantToggleControls: React.FC<ProductVariantToggleControlsProps> = ({
  isPhysicalProduct,
  isInventoryTrackingEnabled,
  onIsPhysicalProductChange,
  onIsInventoryTrackingEnabledChange,
  onSaveChanges,
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4 mb-6 rounded-lg">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-6 flex-wrap items-center">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative inline-block w-10 h-5">
              <input
                type="checkbox"
                checked={isPhysicalProduct}
                onChange={(e) => onIsPhysicalProductChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Is Physical Product
              </p>
              <p className="text-xs text-gray-600">
                {isPhysicalProduct ? 'This is a physical product' : 'This is a digital product'}
              </p>
            </div>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative inline-block w-10 h-5">
              <input
                type="checkbox"
                checked={isInventoryTrackingEnabled}
                onChange={(e) => onIsInventoryTrackingEnabledChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Inventory Tracking
              </p>
              <p className="text-xs text-gray-600">
                {isInventoryTrackingEnabled ? 'Track inventory for this variant' : 'Do not track inventory'}
              </p>
            </div>
          </label>
        </div>
        <button
          onClick={onSaveChanges}
          className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProductVariantToggleControls;

