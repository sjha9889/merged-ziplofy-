import React, { useCallback, useMemo } from "react";
import ProductAdditionalDisplayPrices from "./ProductAdditionalDisplayPrices";

interface ProductPriceSectionProps {
  price: string;
  compareAtPrice: string;
  unitPriceTotalAmount: string;
  unitPriceBaseMeasure: string;
  selectedUnit: string;
  selectedBaseMeasureUnit: string;
  chargeTaxOnProduct: boolean;
  cost: string;
  onPriceChange: (value: string) => void;
  onCompareAtPriceChange: (value: string) => void;
  onUnitPriceTotalAmountChange: (value: string) => void;
  onUnitPriceBaseMeasureChange: (value: string) => void;
  onSelectedUnitChange: (value: string) => void;
  onSelectedBaseMeasureUnitChange: (value: string) => void;
  onChargeTaxOnProductChange: (checked: boolean) => void;
  onCostChange: (value: string) => void;
}

const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({
  price,
  compareAtPrice,
  unitPriceTotalAmount,
  unitPriceBaseMeasure,
  selectedUnit,
  selectedBaseMeasureUnit,
  chargeTaxOnProduct,
  cost,
  onPriceChange,
  onCompareAtPriceChange,
  onUnitPriceTotalAmountChange,
  onUnitPriceBaseMeasureChange,
  onSelectedUnitChange,
  onSelectedBaseMeasureUnitChange,
  onChargeTaxOnProductChange,
  onCostChange,
}) => {
  // Calculate profit and margin
  const { profit, margin } = useMemo(() => {
    const priceNum = parseFloat(price) || 0;
    const costNum = parseFloat(cost) || 0;
    
    if (priceNum === 0 || costNum === 0) {
      return { profit: 0, margin: 0 };
    }
    
    const profitValue = priceNum - costNum;
    const marginValue = (profitValue / priceNum) * 100;
    
    return { profit: profitValue, margin: marginValue };
  }, [price, cost]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceChange(e.target.value);
  }, [onPriceChange]);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Price
      </h2>
      
      <div className="max-w-[460px]">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-500">₹</span>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-8 pr-3 text-base transition-colors focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      <ProductAdditionalDisplayPrices
        compareAtPrice={compareAtPrice}
        unitPriceTotalAmount={unitPriceTotalAmount}
        unitPriceBaseMeasure={unitPriceBaseMeasure}
        selectedUnit={selectedUnit}
        selectedBaseMeasureUnit={selectedBaseMeasureUnit}
        chargeTaxOnProduct={chargeTaxOnProduct}
        cost={cost}
        profit={profit}
        margin={margin}
        onCompareAtPriceChange={onCompareAtPriceChange}
        onUnitPriceTotalAmountChange={onUnitPriceTotalAmountChange}
        onUnitPriceBaseMeasureChange={onUnitPriceBaseMeasureChange}
        onSelectedUnitChange={onSelectedUnitChange}
        onSelectedBaseMeasureUnitChange={onSelectedBaseMeasureUnitChange}
        onChargeTaxOnProductChange={onChargeTaxOnProductChange}
        onCostChange={onCostChange}
      />
    </div>
  );
};

export default ProductPriceSection;

