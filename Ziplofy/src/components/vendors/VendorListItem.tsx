import React from 'react';

interface Vendor {
  _id: string;
  storeId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorListItemProps {
  vendor: Vendor;
}

const VendorListItem: React.FC<VendorListItemProps> = ({ vendor }) => {
  return (
    <div className="px-4 py-3 hover:bg-blue-50/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 text-sm">{vendor.name}</span>
        <span className="text-xs text-gray-500">{new Date(vendor.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default VendorListItem;

