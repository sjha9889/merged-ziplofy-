import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../contexts/store.context';
import { useTransferTags } from '../../contexts/transfer-tags.context';
import DeleteTagConfirmationModal from './DeleteTagConfirmationModal';
import TransferTagsList from './TransferTagsList';

interface Tag {
  _id: string;
  name: string;
}

const TransferTagsSection: React.FC = () => {
  const { tags, loading, error, fetchByStore, createTag, deleteTag } = useTransferTags();
  const { activeStoreId } = useStore();
  const [newTagName, setNewTagName] = useState('');
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const canCreate = useMemo(() => newTagName.trim().length > 0 && !!activeStoreId, [newTagName, activeStoreId]);

  const handleNewTagNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagName(e.target.value);
  }, []);

  const handleAddTag = useCallback(async () => {
    if (!activeStoreId || !newTagName.trim()) return;
    await createTag(activeStoreId, newTagName.trim());
    setNewTagName('');
  }, [activeStoreId, newTagName, createTag]);

  const handleDeleteClick = useCallback((tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (tagToDelete) {
      await deleteTag(tagToDelete._id);
      setIsDeleteModalOpen(false);
      setTagToDelete(null);
    }
  }, [tagToDelete, deleteTag]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
  }, []);

  useEffect(() => {
    if (activeStoreId) {
      fetchByStore(activeStoreId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreId]);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Product transfer tags</h2>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Add new transfer tag"
          value={newTagName}
          onChange={handleNewTagNameChange}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors text-sm"
        />
        <button
          disabled={!canCreate || loading}
          onClick={handleAddTag}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">{error}</p>}
      <TransferTagsList
        tags={tags}
        loading={loading}
        onDeleteClick={handleDeleteClick}
      />
      <DeleteTagConfirmationModal
        isOpen={isDeleteModalOpen}
        tagName={tagToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default TransferTagsSection;

