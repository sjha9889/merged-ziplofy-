import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCustomerToSegmentModal from '../components/segments/AddCustomerToSegmentModal';
import CustomerSegmentEntryList from '../components/segments/CustomerSegmentEntryList';
import DeleteCustomerFromSegmentModal from '../components/segments/DeleteCustomerFromSegmentModal';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useCustomerSegmentEntries } from '../contexts/CustomerSegmentsEntry.context';
import { useCustomers } from '../contexts/customer.context';
import { useCustomerSegments } from '../contexts/customer-segment.context';
import { useStore } from '../contexts/store.context';

const CustomerSegmentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, fetchEntriesBySegmentId, createEntry, deleteEntry, loading } = useCustomerSegmentEntries();
  const { customers, fetchCustomersByStoreId } = useCustomers();
  const { segments, fetchSegmentsByStoreId } = useCustomerSegments();
  const { activeStoreId } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{
    _id: string;
    customerId: string | {
      fullName?: string;
      firstName?: string;
      lastName?: string;
    };
    createdAt: string | Date;
  } | null>(null);
  const canSave = useMemo(() => !!selectedCustomerId && !!id, [selectedCustomerId, id]);

  const segment = useMemo(() => segments.find(s => s._id === id), [segments, id]);

  useEffect(() => {
    if (id) {
      fetchEntriesBySegmentId(id).catch(() => {});
    }
  }, [id, fetchEntriesBySegmentId]);

  useEffect(() => {
    if (activeStoreId && customers.length === 0) {
      fetchCustomersByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, customers.length, fetchCustomersByStoreId]);

  useEffect(() => {
    if (activeStoreId && segments.length === 0) {
      fetchSegmentsByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, segments.length, fetchSegmentsByStoreId]);

  const handleOpenAddModal = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddOpen(false);
    setSelectedCustomerId('');
  }, []);

  const handleCustomerChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomerId(e.target.value);
  }, []);

  const handleAddCustomer = useCallback(async () => {
    if (!id || !selectedCustomerId) return;
    try {
      await createEntry(id, selectedCustomerId);
      setSelectedCustomerId('');
      setAddOpen(false);
    } catch {}
  }, [id, selectedCustomerId, createEntry]);

  const handleDeleteClick = useCallback((entry: {
    _id: string;
    customerId: string | {
      fullName?: string;
      firstName?: string;
      lastName?: string;
    };
    createdAt: string | Date;
  }) => {
    setEntryToDelete(entry);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setEntryToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(
    async () => {
      if (!entryToDelete) return;
      try {
        await deleteEntry(entryToDelete._id);
        setDeleteModalOpen(false);
        setEntryToDelete(null);
      } catch {}
    },
    [entryToDelete, deleteEntry]
  );

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/customers/segments')}
                  className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-medium text-gray-900">
                  {segment?.name || 'Segment details'}
                </h1>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-4 px-4">
          {loading ? (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-600">Loading customers...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-600">No customers in this segment yet</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200">
              <CustomerSegmentEntryList
                entries={entries}
                onDelete={handleDeleteClick}
              />
            </div>
          )}
        </div>
      </div>

      <AddCustomerToSegmentModal
        isOpen={addOpen}
        onClose={handleCloseAddModal}
        selectedCustomerId={selectedCustomerId}
        onCustomerChange={handleCustomerChange}
        customers={customers}
        canSave={canSave}
        onSave={handleAddCustomer}
      />

      <DeleteCustomerFromSegmentModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        entry={entryToDelete}
        onConfirm={handleConfirmDelete}
      />
    </GridBackgroundWrapper>
  );
};

export default CustomerSegmentDetailsPage;


