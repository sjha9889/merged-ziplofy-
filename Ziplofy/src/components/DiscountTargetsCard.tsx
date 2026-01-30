import React from "react";
import ChipList from "./ChipList";

interface Product {
  _id: string;
  title?: string;
}

interface Collection {
  _id: string;
  title?: string;
}

interface CustomerSegment {
  _id: string;
  name?: string;
}

interface Customer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface DiscountTargetsCardProps {
  targetProductDetails?: Product[];
  targetProductIds?: string[];
  targetCollectionDetails?: Collection[];
  targetCollectionIds?: string[];
  targetCustomerSegmentDetails?: CustomerSegment[];
  targetCustomerSegmentIds?: string[];
  targetCustomerDetails?: Customer[];
  targetCustomerIds?: string[];
}

const DiscountTargetsCard: React.FC<DiscountTargetsCardProps> = ({
  targetProductDetails,
  targetProductIds,
  targetCollectionDetails,
  targetCollectionIds,
  targetCustomerSegmentDetails,
  targetCustomerSegmentIds,
  targetCustomerDetails,
  targetCustomerIds,
}) => {
  const renderChips = (items: { key: string; label: string }[]) => (
    <ChipList items={items} />
  );

  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Targets</h2>

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Products</h3>
        {targetProductDetails && targetProductDetails.length > 0
          ? renderChips(targetProductDetails.map(p => ({ key: p._id, label: p.title || p._id })))
          : targetProductIds && targetProductIds.length > 0
            ? renderChips(targetProductIds.map(id => ({ key: id, label: id })))
            : <p className="text-xs text-gray-600">None</p>}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Collections</h3>
        {targetCollectionDetails && targetCollectionDetails.length > 0
          ? renderChips(targetCollectionDetails.map(c => ({ key: c._id, label: c.title || c._id })))
          : targetCollectionIds && targetCollectionIds.length > 0
            ? renderChips(targetCollectionIds.map(id => ({ key: id, label: id })))
            : <p className="text-xs text-gray-600">None</p>}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Customer Segments</h3>
        {targetCustomerSegmentDetails && targetCustomerSegmentDetails.length > 0
          ? renderChips(targetCustomerSegmentDetails.map(s => ({ key: s._id, label: s.name || s._id })))
          : targetCustomerSegmentIds && targetCustomerSegmentIds.length > 0
            ? renderChips(targetCustomerSegmentIds.map(id => ({ key: id, label: id })))
            : <p className="text-xs text-gray-600">None</p>}
      </div>

      <hr className="my-3 border-gray-200" />

      <div>
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Customers</h3>
        {targetCustomerDetails && targetCustomerDetails.length > 0
          ? renderChips(targetCustomerDetails.map(c => ({ key: c._id, label: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.email || c._id })))
          : targetCustomerIds && targetCustomerIds.length > 0
            ? renderChips(targetCustomerIds.map(id => ({ key: id, label: id })))
            : <p className="text-xs text-gray-600">None</p>}
      </div>
    </div>
  );
};

export default DiscountTargetsCard;

