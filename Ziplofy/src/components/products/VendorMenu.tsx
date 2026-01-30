import React, { useCallback } from "react";
import VendorList from "./VendorList";

interface Vendor {
  _id: string;
  name: string;
}

interface VendorMenuProps {
  vendors: Vendor[];
  debouncedQuery: string;
  queryExists: boolean;
  onVendorSelect: (vendorId: string, vendorName: string) => void;
  onCreateVendor: () => void;
}

const VendorMenu: React.FC<VendorMenuProps> = ({
  vendors,
  debouncedQuery,
  queryExists,
  onVendorSelect,
  onCreateVendor,
}) => {
  const handleMenuMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-72 overflow-y-auto shadow-lg"
      onMouseDown={handleMenuMouseDown}
    >
      <VendorList
        vendors={vendors}
        onVendorSelect={onVendorSelect}
      />
      {debouncedQuery && !queryExists && (
        <div
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors font-medium"
          onClick={onCreateVendor}
        >
          {`+ ${debouncedQuery}`}
        </div>
      )}
    </div>
  );
};

export default VendorMenu;

