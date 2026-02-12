import { BuildingOffice2Icon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import AddVendorModal from '../components/vendors/AddVendorModal';
import VendorList from '../components/vendors/VendorList';
import { useStore } from '../contexts/store.context';
import { useVendors } from '../contexts/vendor.context';

const VendorsPage: React.FC = () => {
  const { vendors, fetchVendorsByStoreId, loading, createVendor } = useVendors();
  const { activeStoreId } = useStore();
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');

  useEffect(() => {
    if (activeStoreId) {
      fetchVendorsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchVendorsByStoreId]);

  const handleOpenModal = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setVendorName('');
  }, []);

  const handleVendorNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorName(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!activeStoreId || !vendorName.trim()) {
      setOpen(false);
      return;
    }
    try {
      await createVendor({ storeId: activeStoreId, name: vendorName.trim() });
    } finally {
      setVendorName('');
      setOpen(false);
    }
  }, [activeStoreId, vendorName, createVendor]);


  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="pl-3 border-l-4 border-blue-500/60">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendors</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your product suppliers</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Vendor
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <BuildingOffice2Icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No vendors yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Add vendors to organize your product suppliers and track where your products come from.
              </p>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Vendor
              </button>
            </div>
          ) : (
            <VendorList vendors={vendors} />
          )}
        </div>
      </div>

      <AddVendorModal
          isOpen={open}
          onClose={handleCloseModal}
          vendorName={vendorName}
          onVendorNameChange={handleVendorNameChange}
          onSubmit={handleSubmit}
        />
    </div>
  );
};

export default VendorsPage;