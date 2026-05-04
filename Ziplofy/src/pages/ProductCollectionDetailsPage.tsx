import {
  ArrowLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  HomeIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddProductsToCollectionSection from '../components/collections/AddProductsToCollectionSection';
import CollectionOverviewSection from '../components/collections/CollectionOverviewSection';
import DeleteCollectionModal from '../components/collections/DeleteCollectionModal';
import EditCollectionModal from '../components/collections/EditCollectionModal';
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

  useEffect(() => {
    if (collection?.storeId) {
      fetchProductsByStoreId(collection.storeId);
    }
  }, [collection?.storeId, fetchProductsByStoreId]);

  useEffect(() => {
    if (id) {
      fetchCollectionEntriesByCollectionId(id);
    }
  }, [id, fetchCollectionEntriesByCollectionId]);

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
    setSearchQuery(event.target.value);
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
    } catch (error) {
      console.error('Failed to add products to collection:', error);
    }
  }, [collection?._id, selectedProducts, createCollectionEntry]);

  const handleRemoveProductFromCollection = useCallback(
    async (entryId: string) => {
      try {
        await deleteCollectionEntry(entryId);
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

  const handleProductClick = useCallback(
    (product: any) => {
      handleProductSelect(product);
    },
    [handleProductSelect]
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

  const productCount = collectionEntries.length;

  if (!collection) {
    return (
      <div className="min-h-screen bg-page-background-color">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden />
            Collections
          </button>
          <div className="flex flex-col items-center rounded-2xl border border-gray-200/80 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
              <FolderIcon className="h-8 w-8 text-gray-400" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Collection not found</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              This collection isn&apos;t loaded yet or doesn&apos;t exist. Open it from the collections list or
              check the link.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-8 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Back to collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 space-y-5">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden />
            Collections
          </button>

          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <HomeIcon className="h-3.5 w-3.5" aria-hidden />
              Products
            </button>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg px-2 py-1 font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              Collections
            </button>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
            <span className="rounded-lg bg-gray-100/80 px-2 py-1 font-semibold text-gray-900" aria-current="page">
              {collection.title}
            </span>
          </nav>
        </header>

        <section className="mb-8 rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-blue-50/25 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 border-l-4 border-blue-500/70 pl-4">
              <div className="flex flex-wrap items-center gap-2 gap-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                  {collection.title}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    collection.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {collection.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              {collection.description ? (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">{collection.description}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-400">No description</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 font-medium text-gray-700 ring-1 ring-gray-200/80">
                  <RectangleStackIcon className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </span>
                {collection.urlHandle ? (
                  <span className="font-mono text-gray-500">
                    /{collection.urlHandle}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-5">
            <CollectionOverviewSection
              collection={collection}
              onEdit={() => setEditOpen(true)}
              onDelete={() => setConfirmOpen(true)}
            />
            <AddProductsToCollectionSection
              searchQuery={searchQuery}
              filteredProducts={filteredProducts}
              selectedProducts={selectedProducts}
              onSearchChange={handleSearchChange}
              onProductSelect={handleProductClick}
            />
            <SelectedProductsToAddSection
              selectedProducts={selectedProducts}
              loading={collectionEntriesLoading}
              onRemoveProduct={handleRemoveProduct}
              onAddProducts={handleAddProductsToCollection}
              onClearAll={() => setSelectedProducts([])}
            />
          </div>

          <div className="lg:col-span-7">
            <ProductsInCollectionSection
              collectionEntries={collectionEntries}
              loading={collectionEntriesLoading}
              onProductClick={handleNavigateToProduct}
              onRemoveProduct={handleRemoveProductWithStopPropagation}
            />
          </div>
        </div>
      </div>

      <EditCollectionModal
        isOpen={editOpen}
        formData={editForm}
        onChange={handleEditFormChange}
        onClose={() => setEditOpen(false)}
        onUpdate={handleUpdateCollection}
      />

      <DeleteCollectionModal
        isOpen={confirmOpen}
        collectionTitle={collection?.title}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteCollection}
      />
    </div>
  );
};

export default ProductCollectionDetailsPage;
