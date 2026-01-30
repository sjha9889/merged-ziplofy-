import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useState } from "react";

interface ProductUnitPriceSectionProps {
  unitPriceTotalAmount: string;
  unitPriceBaseMeasure: string;
  selectedUnit: string;
  selectedBaseMeasureUnit: string;
  onUnitPriceTotalAmountChange: (value: string) => void;
  onUnitPriceBaseMeasureChange: (value: string) => void;
  onSelectedUnitChange: (value: string) => void;
  onSelectedBaseMeasureUnitChange: (value: string) => void;
}

// Unit categories data structure
const unitCategories = {
  weight: ['milligram', 'gram', 'kilogram'],
  volume: ['milliliter', 'centiliter', 'liter', 'cubic meter'],
  size: ['millimeter', 'centimeter', 'meter'],
  area: ['square meter'],
  'per item': ['item']
};

const ProductUnitPriceSection: React.FC<ProductUnitPriceSectionProps> = ({
  unitPriceTotalAmount,
  unitPriceBaseMeasure,
  selectedUnit,
  selectedBaseMeasureUnit,
  onUnitPriceTotalAmountChange,
  onUnitPriceBaseMeasureChange,
  onSelectedUnitChange,
  onSelectedBaseMeasureUnitChange,
}) => {
  const [unitPriceDropdownOpen, setUnitPriceDropdownOpen] = useState(false);

  // Get available base measure units based on selected total amount unit
  const getAvailableBaseMeasureUnits = useCallback(() => {
    if (!selectedUnit) return [];
    
    // Find which category the selected unit belongs to
    for (const [category, units] of Object.entries(unitCategories)) {
      if (units.includes(selectedUnit)) {
        return units;
      }
    }
    return [];
  }, [selectedUnit]);

  const handleUnitSelect = useCallback((unit: string) => {
    onSelectedUnitChange(unit);
    onSelectedBaseMeasureUnitChange(""); // Reset base measure unit when total amount unit changes
  }, [onSelectedUnitChange, onSelectedBaseMeasureUnitChange]);

  const handleUnitPriceToggle = useCallback(() => {
    setUnitPriceDropdownOpen(prev => !prev);
  }, []);

  const handleUnitPriceTotalAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUnitPriceTotalAmountChange(e.target.value);
  }, [onUnitPriceTotalAmountChange]);

  const handleUnitSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleUnitSelect(e.target.value);
  }, [handleUnitSelect]);

  const handleUnitPriceBaseMeasureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUnitPriceBaseMeasureChange(e.target.value);
  }, [onUnitPriceBaseMeasureChange]);

  const handleSelectedBaseMeasureUnitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectedBaseMeasureUnitChange(e.target.value);
  }, [onSelectedBaseMeasureUnitChange]);

  return (
    <div>
      <div 
        className="flex items-center justify-between border border-gray-200 rounded px-3 py-1.5 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleUnitPriceToggle}
      >
        <span className="text-base text-gray-600">Unit price</span>
        {unitPriceDropdownOpen ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        )}
      </div>
      
      {unitPriceDropdownOpen && (
        <div className="mt-2 p-3 border border-gray-200 rounded bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={unitPriceTotalAmount}
                  onChange={handleUnitPriceTotalAmountChange}
                  className="w-full pl-7 pr-2 py-2 text-base border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
              </div>
              <select
                value={selectedUnit}
                onChange={handleUnitSelectChange}
                className="px-2 py-2 text-base border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors min-w-[100px]"
              >
                <option value="" disabled>Select unit</option>
                {Object.entries(unitCategories).map(([category, units]) => [
                  <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                    {units.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </optgroup>
                ])}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={unitPriceBaseMeasure}
                  onChange={handleUnitPriceBaseMeasureChange}
                  className="w-full pl-7 pr-2 py-2 text-base border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
              </div>
              <select
                value={selectedBaseMeasureUnit}
                onChange={handleSelectedBaseMeasureUnitChange}
                disabled={!selectedUnit}
                className="px-2 py-2 text-base border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors min-w-[100px] disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {!selectedUnit ? 'Select total unit first' : 'Select unit'}
                </option>
                {getAvailableBaseMeasureUnits().map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUnitPriceSection;

