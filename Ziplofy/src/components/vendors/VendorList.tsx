import React from 'react';
import VendorListItem from './VendorListItem';

interface Vendor {
  _id: string;
  storeId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorListProps {
  vendors: Vendor[];
}

const VendorList: React.FC<VendorListProps> = ({ vendors }) => {
  return (
    <div>
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h2 className="text-sm font-semibold text-gray-900">All Vendors ({vendors.length})</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {vendors.map((v) => (
          <VendorListItem key={v._id} vendor={v} />
        ))}
      </div>
    </div>
  );
};

export default VendorList;

