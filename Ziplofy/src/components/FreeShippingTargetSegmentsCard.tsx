import React from "react";
import ChipList from "./ChipList";

interface FreeShippingTargetSegmentsCardProps {
  targetCustomerSegmentIds: any[];
  segmentLabel: (s: any) => string;
}

const FreeShippingTargetSegmentsCard: React.FC<FreeShippingTargetSegmentsCardProps> = ({
  targetCustomerSegmentIds,
  segmentLabel,
}) => {
  if (!targetCustomerSegmentIds || targetCustomerSegmentIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Target Customer Segments</h2>
      <ChipList items={targetCustomerSegmentIds.map((s: any, idx: number) => ({
        key: s?._id || idx.toString(),
        label: segmentLabel(s)
      }))} />
    </div>
  );
};

export default FreeShippingTargetSegmentsCard;

