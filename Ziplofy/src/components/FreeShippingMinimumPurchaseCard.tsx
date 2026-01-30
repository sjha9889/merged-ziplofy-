import React from "react";

interface FreeShippingMinimumPurchaseCardProps {
  minimumPurchase?: string;
  minimumAmount?: number | string;
  minimumQuantity?: number | string;
}

const FreeShippingMinimumPurchaseCard: React.FC<FreeShippingMinimumPurchaseCardProps> = ({
  minimumPurchase,
  minimumAmount,
  minimumQuantity,
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Minimum Purchase</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Requirement</p>
          <p className="text-sm text-gray-900">{minimumPurchase}</p>
        </div>
        {minimumPurchase === 'minimum-amount' && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Amount</p>
            <p className="text-sm text-gray-900">₹{minimumAmount}</p>
          </div>
        )}
        {minimumPurchase === 'minimum-quantity' && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Quantity</p>
            <p className="text-sm text-gray-900">{minimumQuantity}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeShippingMinimumPurchaseCard;

