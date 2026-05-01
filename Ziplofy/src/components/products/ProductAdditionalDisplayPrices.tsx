import React, { useCallback } from "react";
import CompareAtPriceInput from "./CompareAtPriceInput";
import ProductTaxCheckbox from "./ProductTaxCheckbox";
import ProductUnitPriceSection from "./ProductUnitPriceSection";

interface ProductAdditionalDisplayPricesProps {
  compareAtPrice: string;
  unitPriceTotalAmount: string;
  unitPriceBaseMeasure: string;
  selectedUnit: string;
  selectedBaseMeasureUnit: string;
  chargeTaxOnProduct: boolean;
  cost: string;
  profit: number;
  margin: number;
  onCompareAtPriceChange: (value: string) => void;
  onUnitPriceTotalAmountChange: (value: string) => void;
  onUnitPriceBaseMeasureChange: (value: string) => void;
  onSelectedUnitChange: (value: string) => void;
  onSelectedBaseMeasureUnitChange: (value: string) => void;
  onChargeTaxOnProductChange: (checked: boolean) => void;
  onCostChange: (value: string) => void;
}

const ProductAdditionalDisplayPrices: React.FC<ProductAdditionalDisplayPricesProps> = ({
  compareAtPrice,
  unitPriceTotalAmount,
  unitPriceBaseMeasure,
  selectedUnit,
  selectedBaseMeasureUnit,
  chargeTaxOnProduct,
  cost,
  profit,
  margin,
  onCompareAtPriceChange,
  onUnitPriceTotalAmountChange,
  onUnitPriceBaseMeasureChange,
  onSelectedUnitChange,
  onSelectedBaseMeasureUnitChange,
  onChargeTaxOnProductChange,
  onCostChange,
}) => {
  const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCostChange(e.target.value);
  }, [onCostChange]);

  return (
    <div className="mt-6 border-t border-gray-100 pt-5">
      <h3 className="mb-3 text-sm font-medium text-gray-700">
        Additional pricing details
      </h3>
      
      <div className="space-y-4">
        <CompareAtPriceInput
          value={compareAtPrice}
          onChange={onCompareAtPriceChange}
        />
        
        <ProductUnitPriceSection
          unitPriceTotalAmount={unitPriceTotalAmount}
          unitPriceBaseMeasure={unitPriceBaseMeasure}
          selectedUnit={selectedUnit}
          selectedBaseMeasureUnit={selectedBaseMeasureUnit}
          onUnitPriceTotalAmountChange={onUnitPriceTotalAmountChange}
          onUnitPriceBaseMeasureChange={onUnitPriceBaseMeasureChange}
          onSelectedUnitChange={onSelectedUnitChange}
          onSelectedBaseMeasureUnitChange={onSelectedBaseMeasureUnitChange}
        />
      </div>
      
      {/* Tax Checkbox */}
      <ProductTaxCheckbox
        checked={chargeTaxOnProduct}
        onChange={onChargeTaxOnProductChange}
      />

      {/* Cost, Profit, and Margin Fields */}
      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base">₹</span>
              <input
                type="number"
                value={cost}
                onChange={handleCostChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-base transition-colors focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Profit
            </label>
            <input
              type="text"
              value={`₹${profit.toFixed(2)}`}
              readOnly
              className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-medium ${
                profit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Margin
            </label>
            <input
              type="text"
              value={`${margin.toFixed(2)}%`}
              readOnly
              className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-medium ${
                margin >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdditionalDisplayPrices;

