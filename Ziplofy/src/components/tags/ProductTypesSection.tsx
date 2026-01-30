import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useProductType } from '../../contexts/product-type.context';
import { useStore } from '../../contexts/store.context';
import DeleteTagConfirmationModal from './DeleteTagConfirmationModal';
import ProductTypesList from './ProductTypesList';

interface Tag {
  _id: string;
  name: string;
}

const ProductTypesSection: React.FC = () => {
  const { productTypes, loading, error, createProductType, getProductTypesByStoreId, deleteProductType } = useProductType();
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
    await createProductType({ storeId: activeStoreId, name: newTagName.trim() });
    setNewTagName('');
  }, [activeStoreId, newTagName, createProductType]);

  const handleDeleteClick = useCallback((tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (tagToDelete) {
      await deleteProductType(tagToDelete._id);
      setIsDeleteModalOpen(false);
      setTagToDelete(null);
    }
  }, [tagToDelete, deleteProductType]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
  }, []);

  useEffect(() => {
    if (activeStoreId) {
      getProductTypesByStoreId(activeStoreId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreId]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-base font-medium text-gray-900 mb-3">Product types</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add new product type"
          value={newTagName}
          onChange={handleNewTagNameChange}
          className="flex-1 px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-300 outline-none transition-colors text-sm"
        />
        <button
          disabled={!canCreate || loading}
          onClick={handleAddTag}
          className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <ProductTypesList
        tags={productTypes}
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

export default ProductTypesSection;

