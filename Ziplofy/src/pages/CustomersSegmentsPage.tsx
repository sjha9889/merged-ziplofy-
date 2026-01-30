import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSegmentModal from '../components/segments/CreateSegmentModal';
import CustomerSegmentsTable from '../components/segments/CustomerSegmentsTable';
import EditSegmentModal from '../components/segments/EditSegmentModal';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useCustomerSegments } from '../contexts/customer-segment.context';
import { useStore } from '../contexts/store.context';

const CustomersSegmentsPage: React.FC = () => {
  const { segments, createCustomerSegment, fetchSegmentsByStoreId, updateCustomerSegmentName, loading } = useCustomerSegments();
  const { activeStoreId } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editingId, setEditingId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const storeId = useMemo(() => activeStoreId || "", [activeStoreId]);

  // Sort segments by createdAt
  const sortedSegments = useMemo(() => {
    const sorted = [...segments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }, [segments, sortOrder]);

  useEffect(() => {
    if (storeId) {
      fetchSegmentsByStoreId(storeId).catch(() => {});
    }
  }, [storeId, fetchSegmentsByStoreId]);

  const handleCreate = useCallback(async () => {
    if (!name.trim() || !storeId) return;
    try {
      await createCustomerSegment(storeId, name.trim());
      setName('');
      setOpen(false);
    } catch {}
  }, [name, storeId, createCustomerSegment]);

  const handleEdit = useCallback(async () => {
    if (!editName.trim() || !editingId) return;
    try {
      await updateCustomerSegmentName(editingId, editName.trim());
      setEditOpen(false);
    } catch {}
  }, [editName, editingId, updateCustomerSegmentName]);

  const handleOpenCreateModal = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenEditModal = useCallback((segmentId: string, segmentName: string) => {
    setEditingId(segmentId);
    setEditName(segmentName);
    setEditOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditOpen(false);
  }, []);

  const handleSegmentClick = useCallback(
    (segmentId: string) => {
      navigate(`/customers/segments/${segmentId}`);
    },
    [navigate]
  );

  const handleEditClick = useCallback(
    (e: React.MouseEvent, segmentId: string, segmentName: string) => {
      e.stopPropagation();
      handleOpenEditModal(segmentId, segmentName);
    },
    [handleOpenEditModal]
  );

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium text-gray-900">Customer segments</h1>
                <p className="text-sm text-gray-600 mt-0.5">Organize customers into groups</p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Create customer segment
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-4">
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            ) : segments.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-600">No customer segments</p>
              </div>
            ) : (
              <CustomerSegmentsTable
                segments={sortedSegments}
                sortOrder={sortOrder}
                onSortToggle={handleSortToggle}
                onSegmentClick={handleSegmentClick}
                onEditClick={handleEditClick}
              />
            )}
          </div>
        </div>
      </div>

      <CreateSegmentModal
        isOpen={open}
        name={name}
        storeId={storeId}
        onNameChange={setName}
        onClose={handleCloseCreateModal}
        onCreate={handleCreate}
      />
      <EditSegmentModal
        isOpen={editOpen}
        editName={editName}
        onNameChange={setEditName}
        onClose={handleCloseEditModal}
        onSave={handleEdit}
      />
    </GridBackgroundWrapper>
  );
};

export default CustomersSegmentsPage;


