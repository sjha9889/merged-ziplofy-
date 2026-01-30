import React from "react";
import ChipList from "./ChipList";

interface FreeShippingTargetCustomersCardProps {
  targetCustomerIds: any[];
  customerLabel: (c: any) => string;
}

const FreeShippingTargetCustomersCard: React.FC<FreeShippingTargetCustomersCardProps> = ({
  targetCustomerIds,
  customerLabel,
}) => {
  if (!targetCustomerIds || targetCustomerIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Target Customers</h2>
      <ChipList items={targetCustomerIds.map((c: any, idx: number) => ({
        key: c?._id || idx.toString(),
        label: customerLabel(c)
      }))} />
    </div>
  );
};

export default FreeShippingTargetCustomersCard;

