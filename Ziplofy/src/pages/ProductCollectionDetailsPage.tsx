import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddProductsToCollectionSection from '../components/collections/AddProductsToCollectionSection';
import CollectionOverviewSection from '../components/collections/CollectionOverviewSection';
import DeleteCollectionModal from '../components/collections/DeleteCollectionModal';
import EditCollectionModal from '../components/collections/EditCollectionModal';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import ProductsInCollectionSection from '../components/collections/ProductsInCollectionSection';
import SelectedProductsToAddSection from '../components/collections/SelectedProductsToAddSection';
import { useCollectionEntries } from '../contexts/collection-entries.context';
import { useCollections } from '../contexts/collection.context';
import { useProducts } from '../contexts/product.context';

const ProductCollectionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, deleteCollection, updateCollection } = useCollections();
  const { fetchProductsByStoreId, searchBasic } = useProducts();
  const {
    createCollectionEntry,
    deleteCollectionEntry,
    fetchCollectionEntriesByCollectionId,
    collectionEntries,
    loading: collectionEntriesLoading,
  } = useCollectionEntries();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const collection = collections.find((c) => c._id === id);

  const initialEdit = useMemo(
    () => ({
      title: collection?.title || '',
      description: collection?.description || '',
      pageTitle: collection?.pageTitle || '',
      metaDescription: collection?.metaDescription || '',
      urlHandle: collection?.urlHandle || '',
      status: (collection?.status as 'draft' | 'published') || 'published',
    }),
    [collection]
  );
  const [editForm, setEditForm] = useState(initialEdit);
  useEffect(() => {
    setEditForm(initialEdit);
  }, [initialEdit]);

  // Fetch products when component mounts
  useEffect(() => {
    if (collection?.storeId) {
      fetchProductsByStoreId(collection.storeId);
    }
  }, [collection?.storeId, fetchProductsByStoreId]);

  // Fetch collection entries when component mounts
  useEffect(() => {
    if (id) {
      fetchCollectionEntriesByCollectionId(id);
    }
  }, [id, fetchCollectionEntriesByCollectionId]);

  // Remote search using searchBasic with debouncing
  useEffect(() => {
    let cancelled = false;
    const doSearch = async () => {
      const q = searchQuery.trim();
      if (!q) {
        setFilteredProducts([]);
        return;
      }
      try {
        const res = await searchBasic({ q, storeId: collection?.storeId });
        if (!cancelled) setFilteredProducts(res as any);
      } catch {
        if (!cancelled) setFilteredProducts([]);
      }
    };

    // Debounce: wait 300ms after user stops typing
    const timeoutId = setTimeout(() => {
      doSearch();
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, searchBasic, collection?.storeId]);

  const handleBack = useCallback(() => {
    navigate('/products/collections');
  }, [navigate]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleProductSelect = useCallback(
    (product: any) => {
      const isAlreadySelected = selectedProducts.some((p) => p._id === product._id);

      if (!isAlreadySelected) {
        setSelectedProducts((prev) => [...prev, product]);
      }

      handleSearchClose();
    },
    [selectedProducts, handleSearchClose]
  );

  const handleRemoveProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  }, []);

  const handleAddProductsToCollection = useCallback(async () => {
    if (!collection?._id || selectedProducts.length === 0) return;

    try {
      const promises = selectedProducts.map((product) =>
        createCollectionEntry({
          collectionId: collection._id,
          productId: product._id,
        })
      );

      await Promise.all(promises);
      setSelectedProducts([]);
      console.log('Successfully added products to collection');
    } catch (error) {
      console.error('Failed to add products to collection:', error);
    }
  }, [collection?._id, selectedProducts, createCollectionEntry]);

  const handleRemoveProductFromCollection = useCallback(
    async (entryId: string) => {
      try {
        await deleteCollectionEntry(entryId);
        console.log('Successfully removed product from collection');
      } catch (error) {
        console.error('Failed to remove product from collection:', error);
      }
    },
    [deleteCollectionEntry]
  );

  const handleDeleteCollection = useCallback(async () => {
    if (collection?._id) {
      try {
        await deleteCollection(collection._id);
      } finally {
        navigate('/products/collections');
      }
    } else {
      setConfirmOpen(false);
    }
  }, [collection?._id, deleteCollection, navigate]);

  const handleUpdateCollection = useCallback(async () => {
    if (!collection?._id) {
      setEditOpen(false);
      return;
    }
    try {
      await updateCollection(collection._id, {
        title: editForm.title,
        description: editForm.description,
        pageTitle: editForm.pageTitle,
        metaDescription: editForm.metaDescription,
        urlHandle: editForm.urlHandle,
        status: editForm.status,
      });
      setEditOpen(false);
    } catch {}
  }, [collection?._id, editForm, updateCollection]);

  const handleOpenEditModal = useCallback(() => {
    setEditOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditOpen(false);
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleClearSelectedProducts = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const handleProductClick = useCallback(
    (product: any) => {
      handleProductSelect(product);
    },
    [handleProductSelect]
  );

  const handleRemoveSelectedProduct = useCallback(
    (productId: string) => {
      handleRemoveProduct(productId);
    },
    [handleRemoveProduct]
  );

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      if (productId) {
        navigate(`/products/${productId}`);
      }
    },
    [navigate]
  );

  const handleRemoveProductWithStopPropagation = useCallback(
    (e: React.MouseEvent, entryId: string) => {
      e.stopPropagation();
      handleRemoveProductFromCollection(entryId);
    },
    [handleRemoveProductFromCollection]
  );

  const handleEditFormChange = useCallback(
    (field: keyof typeof editForm, value: string | 'draft' | 'published') => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const showSearchDropdown = searchQuery.trim() && filteredProducts.length > 0;

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                aria-label="Back"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <h1 className="text-xl font-medium text-gray-900">{collection?.title || 'Collection'}</h1>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {!collection ? (
          <div className="text-sm text-gray-600">Collection not found in state.</div>
        ) : (
          <>
            {/* Overview Section */}
            <CollectionOverviewSection
              collection={collection}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            {/* Add products to collection section */}
            <AddProductsToCollectionSection
              searchQuery={searchQuery}
              filteredProducts={filteredProducts}
              selectedProducts={selectedProducts}
              onSearchChange={handleSearchChange}
              onProductSelect={handleProductClick}
            />

            {/* Selected products to be added */}
            <SelectedProductsToAddSection
              selectedProducts={selectedProducts}
              loading={collectionEntriesLoading}
              onRemoveProduct={handleRemoveSelectedProduct}
              onAddProducts={handleAddProductsToCollection}
              onClearAll={handleClearSelectedProducts}
            />

            {/* Products in collection */}
            <ProductsInCollectionSection
              collectionEntries={collectionEntries}
              loading={collectionEntriesLoading}
              onProductClick={handleNavigateToProduct}
              onRemoveProduct={handleRemoveProductWithStopPropagation}
            />
          </>
        )}
      </div>

      {/* Edit Collection Modal */}
      <EditCollectionModal
        isOpen={editOpen}
        formData={editForm}
        onChange={handleEditFormChange}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateCollection}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCollectionModal
        isOpen={confirmOpen}
        collectionTitle={collection?.title}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCollection}
      />
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductCollectionDetailsPage;
