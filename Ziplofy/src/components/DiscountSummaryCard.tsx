import React from "react";

interface DiscountSummaryCardProps {
  appliesTo?: string;
  eligibility?: string;
  minimumPurchase?: string;
  minimumQuantity?: number | string;
}

const DiscountSummaryCard: React.FC<DiscountSummaryCardProps> = ({
  appliesTo,
  eligibility,
  minimumPurchase,
  minimumQuantity,
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Applies to</p>
          <p className="text-sm text-gray-900">{appliesTo}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Eligibility</p>
          <p className="text-sm text-gray-900">{eligibility}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Minimum purchase</p>
          <p className="text-sm text-gray-900">{minimumPurchase || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Minimum quantity</p>
          <p className="text-sm text-gray-900">{minimumQuantity ?? '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscountSummaryCard;

