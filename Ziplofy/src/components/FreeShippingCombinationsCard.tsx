import React from "react";

interface FreeShippingCombinationsCardProps {
  productDiscounts?: boolean;
  orderDiscounts?: boolean;
}

const FreeShippingCombinationsCard: React.FC<FreeShippingCombinationsCardProps> = ({
  productDiscounts,
  orderDiscounts,
}) => {
  const renderBoolean = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Combinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Product Discounts</p>
          <p className="text-sm text-gray-900">{renderBoolean(productDiscounts)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Order Discounts</p>
          <p className="text-sm text-gray-900">{renderBoolean(orderDiscounts)}</p>
        </div>
      </div>
    </div>
  );
};

export default FreeShippingCombinationsCard;

