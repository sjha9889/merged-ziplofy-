import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
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
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Vendors</h1>
            <button
              onClick={handleOpenModal}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="border border-gray-200">
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-6">
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                ) : vendors.length === 0 ? (
                  <p className="text-sm text-gray-600">No vendors found for this store.</p>
                ) : (
                  <VendorList vendors={vendors} />
                )}
              </div>
            </div>
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
    </GridBackgroundWrapper>
  );
};

export default VendorsPage;