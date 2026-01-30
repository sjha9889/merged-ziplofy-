import React, { useCallback } from "react";

interface ProductInventorySectionProps {
  inventoryTrackingEnabled: boolean;
  sku: string;
  barcode: string;
  continueSellingWhenOutOfStock: boolean;
  onInventoryTrackingEnabledChange: (checked: boolean) => void;
  onSkuChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
  onContinueSellingWhenOutOfStockChange: (checked: boolean) => void;
}

const ProductInventorySection: React.FC<ProductInventorySectionProps> = ({
  inventoryTrackingEnabled,
  sku,
  barcode,
  continueSellingWhenOutOfStock,
  onInventoryTrackingEnabledChange,
  onSkuChange,
  onBarcodeChange,
  onContinueSellingWhenOutOfStockChange,
}) => {
  const handleInventoryTrackingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onInventoryTrackingEnabledChange(e.target.checked);
  }, [onInventoryTrackingEnabledChange]);

  const handleSkuChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSkuChange(e.target.value);
  }, [onSkuChange]);

  const handleBarcodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBarcodeChange(e.target.value);
  }, [onBarcodeChange]);

  const handleContinueSellingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onContinueSellingWhenOutOfStockChange(e.target.checked);
  }, [onContinueSellingWhenOutOfStockChange]);

  return (
    <div className="mb-6 border border-gray-200 p-3 bg-white/95">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-gray-900">
          Inventory
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inventoryTrackingEnabled}
            onChange={handleInventoryTrackingChange}
            className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-400 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Inventory tracking enabled</span>
        </label>
      </div>

      {/* More Details Sub-segment */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          More Details
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              value={sku}
              onChange={handleSkuChange}
              placeholder="Enter SKU"
              className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode (ISBN, UPC, GTIN, etc.)
            </label>
            <input
              type="text"
              value={barcode}
              onChange={handleBarcodeChange}
              placeholder="Enter barcode"
              className="w-full px-3 py-2 border border-gray-200 rounded text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Continue Selling Checkbox (only when tracking is enabled) */}
        {inventoryTrackingEnabled && (
          <div className="mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={continueSellingWhenOutOfStock}
                onChange={handleContinueSellingChange}
                className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-400 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Continue selling when out of stock</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInventorySection;

