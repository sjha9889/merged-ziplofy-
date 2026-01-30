import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GiftCardTable from '../components/gift-card/GiftCardTable';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useGiftCards } from '../contexts/gift-cards.context';
import { useStore } from '../contexts/store.context';

type SortOrder = 'asc' | 'desc';

const GiftCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { giftCards, loading, error, fetchGiftCardsByStoreId } = useGiftCards();
  const { activeStoreId } = useStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleCreateGiftCard = useCallback(() => {
    navigate('/products/gift-cards/new');
  }, [navigate]);

  const handleGiftCardClick = useCallback(
    (giftCardId: string) => {
      navigate(`/products/gift-cards/${giftCardId}`);
    },
    [navigate]
  );

  // Fetch gift cards when component mounts or activeStoreId changes
  useEffect(() => {
    if (activeStoreId) {
      fetchGiftCardsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchGiftCardsByStoreId]);

  // Sort gift cards by createdAt
  const sortedGiftCards = useMemo(() => {
    const sorted = [...giftCards].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }, [giftCards, sortOrder]);

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
              <div>
                <h1 className="text-xl font-medium text-gray-900">Gift Cards</h1>
                <p className="text-sm text-gray-600 mt-0.5">Manage your gift cards and create new ones</p>
              </div>
              {giftCards.length > 0 && (
                <button
                  onClick={handleCreateGiftCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Gift Card
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Gift Cards List or Empty State */}
        {!loading && !error && (
          <>
            {giftCards.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-6 text-center">
                <h2 className="text-base font-medium text-gray-900 mb-2">
                  No gift cards yet
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Create your first gift card to get started
                </p>
                
                <button
                  onClick={handleCreateGiftCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Gift Card
                </button>
              </div>
            ) : (
              <div className="bg-white rounded border border-gray-200">
                {/* Header with Count */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-base font-medium text-gray-900">
                    {giftCards.length} Gift Card{giftCards.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                {/* Gift Cards Table */}
                <GiftCardTable
                  giftCards={sortedGiftCards}
                  onGiftCardClick={handleGiftCardClick}
                  sortOrder={sortOrder}
                  onSortToggle={handleSortToggle}
                />
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default GiftCardsPage;
