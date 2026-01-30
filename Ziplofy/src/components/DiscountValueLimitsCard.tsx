import React from "react";

interface DiscountValueLimitsCardProps {
  valueType?: string;
  value: string;
  oncePerOrder?: boolean;
  allowDiscountOnChannels?: boolean;
  limitTotalUses?: boolean;
  totalUsesLimit?: number | string;
  limitOneUsePerCustomer?: boolean;
  productDiscounts?: boolean;
  orderDiscounts?: boolean;
  shippingDiscounts?: boolean;
}

const DiscountValueLimitsCard: React.FC<DiscountValueLimitsCardProps> = ({
  valueType,
  value,
  oncePerOrder,
  allowDiscountOnChannels,
  limitTotalUses,
  totalUsesLimit,
  limitOneUsePerCustomer,
  productDiscounts,
  orderDiscounts,
  shippingDiscounts,
}) => {
  const yesNo = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Value & Limits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Value type</p>
          <p className="text-sm text-gray-900">{valueType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Value</p>
          <p className="text-sm text-gray-900">{value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Once per order</p>
          <p className="text-sm text-gray-900">{yesNo(oncePerOrder)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Allow discount on channels</p>
          <p className="text-sm text-gray-900">{yesNo(allowDiscountOnChannels)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Limit total uses</p>
          <p className="text-sm text-gray-900">{limitTotalUses ? `Yes (${totalUsesLimit ?? '-'})` : 'No'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Limit one use per customer</p>
          <p className="text-sm text-gray-900">{yesNo(limitOneUsePerCustomer)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Product discounts combinable</p>
          <p className="text-sm text-gray-900">{yesNo(productDiscounts)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Order discounts combinable</p>
          <p className="text-sm text-gray-900">{yesNo(orderDiscounts)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Shipping discounts combinable</p>
          <p className="text-sm text-gray-900">{yesNo(shippingDiscounts)}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscountValueLimitsCard;

