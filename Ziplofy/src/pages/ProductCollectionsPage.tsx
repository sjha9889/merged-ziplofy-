import { PlusIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectionsTable from '../components/collections/CollectionsTable';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useCollections } from '../contexts/collection.context';
import { useStore } from '../contexts/store.context';

type SortOrder = 'asc' | 'desc';

const ProductCollectionsPage: React.FC = () => {
  const { collections, fetchCollectionsByStoreId, loading } = useCollections();
  const { activeStoreId } = useStore();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    if (activeStoreId) {
      fetchCollectionsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchCollectionsByStoreId]);

  const handleAddCollection = useCallback(() => {
    navigate('/products/collections/new');
  }, [navigate]);

  const handleCollectionClick = useCallback(
    (collectionId: string) => {
      navigate(`/products/collections/${collectionId}`);
    },
    [navigate]
  );

  // Sort collections by updatedAt
  const sortedCollections = useMemo(() => {
    const sorted = [...collections].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }, [collections, sortOrder]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RectangleStackIcon className="w-5 h-5 text-gray-600" />
                <h1 className="text-xl font-medium text-gray-900">Collections</h1>
              </div>
              <button
                onClick={handleAddCollection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Collection
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && collections.length === 0 && (
            <div className="bg-white rounded border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-600">No collections found for this store.</p>
            </div>
          )}

          {/* Collections Table */}
          {!loading && collections.length > 0 && (
            <CollectionsTable
              collections={sortedCollections}
              onCollectionClick={handleCollectionClick}
              sortOrder={sortOrder}
              onSortToggle={handleSortToggle}
            />
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductCollectionsPage;


