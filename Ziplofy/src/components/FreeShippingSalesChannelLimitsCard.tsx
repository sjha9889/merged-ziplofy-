import React from "react";

interface FreeShippingSalesChannelLimitsCardProps {
  allowDiscountOnChannels?: boolean;
  limitTotalUses?: boolean;
  totalUsesLimit?: number | string;
  limitOneUsePerCustomer?: boolean;
}

const FreeShippingSalesChannelLimitsCard: React.FC<FreeShippingSalesChannelLimitsCardProps> = ({
  allowDiscountOnChannels,
  limitTotalUses,
  totalUsesLimit,
  limitOneUsePerCustomer,
}) => {
  const renderBoolean = (v?: boolean) => (v ? 'Yes' : 'No');

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Sales Channel & Limits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Allow on Channels</p>
          <p className="text-sm text-gray-900">{renderBoolean(allowDiscountOnChannels)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Limit Total Uses</p>
          <p className="text-sm text-gray-900">{renderBoolean(limitTotalUses)}</p>
        </div>
        {limitTotalUses && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Uses Limit</p>
            <p className="text-sm text-gray-900">{totalUsesLimit}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-600 mb-1">One Use Per Customer</p>
          <p className="text-sm text-gray-900">{renderBoolean(limitOneUsePerCustomer)}</p>
        </div>
      </div>
    </div>
  );
};

export default FreeShippingSalesChannelLimitsCard;

