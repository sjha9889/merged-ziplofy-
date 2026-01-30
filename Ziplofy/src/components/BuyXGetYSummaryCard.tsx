import React from "react";

interface BuyXGetYSummaryCardProps {
  customerBuys?: string;
  quantity?: number;
  amount?: number;
  anyItemsFrom?: string;
  customerGetsQuantity?: number;
  customerGetsAnyItemsFrom?: string;
  value: string;
  eligibility?: string;
  allowDiscountOnChannels?: boolean;
  limitTotalUses?: boolean;
  totalUsesLimit?: number | string;
  limitOneUsePerCustomer?: boolean;
  productDiscounts?: boolean;
  orderDiscounts?: boolean;
  shippingDiscounts?: boolean;
  startDate?: string;
  startTime?: string;
  setEndDate?: boolean;
  endDate?: string;
  endTime?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const BuyXGetYSummaryCard: React.FC<BuyXGetYSummaryCardProps> = ({
  customerBuys,
  quantity,
  amount,
  anyItemsFrom,
  customerGetsQuantity,
  customerGetsAnyItemsFrom,
  value,
  eligibility,
  allowDiscountOnChannels,
  limitTotalUses,
  totalUsesLimit,
  limitOneUsePerCustomer,
  productDiscounts,
  orderDiscounts,
  shippingDiscounts,
  startDate,
  startTime,
  setEndDate,
  endDate,
  endTime,
  createdAt,
  updatedAt,
}) => {
  const yesNo = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Customer buys</p>
          <p className="text-sm text-gray-900">
            {customerBuys}
            {customerBuys === 'minimum-quantity' && quantity ? ` (${quantity})` : customerBuys === 'minimum-amount' && amount ? ` (₹${amount})` : ''}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Any items from</p>
          <p className="text-sm text-gray-900">{anyItemsFrom}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Customer gets quantity</p>
          <p className="text-sm text-gray-900">{customerGetsQuantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Gets from</p>
          <p className="text-sm text-gray-900">{customerGetsAnyItemsFrom}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Value</p>
          <p className="text-sm text-gray-900">{value}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Eligibility</p>
          <p className="text-sm text-gray-900">{eligibility}</p>
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
          <p className="text-xs text-gray-600 mb-1">Combinations</p>
          <p className="text-sm text-gray-900">Product: {yesNo(productDiscounts)} • Order: {yesNo(orderDiscounts)} • Shipping: {yesNo(shippingDiscounts)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Active dates</p>
          <p className="text-sm text-gray-900">
            {[startDate, startTime].filter(Boolean).join(' ') || '-'} → {setEndDate ? ([endDate, endTime].filter(Boolean).join(' ') || '-') : 'No end date'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Created / Updated</p>
          <p className="text-sm text-gray-900">
            {createdAt ? new Date(createdAt).toLocaleDateString() : '-'} / {updatedAt ? new Date(updatedAt).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyXGetYSummaryCard;

