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
    <div className="divide-y divide-gray-200">
      {vendors.map((v) => (
        <VendorListItem key={v._id} vendor={v} />
      ))}
    </div>
  );
};

export default VendorList;

