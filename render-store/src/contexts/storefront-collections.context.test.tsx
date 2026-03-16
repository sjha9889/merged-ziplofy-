import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorefrontCollectionsProvider, useStorefrontCollections } from './storefront-collections.context';

vi.mock('../config/axios.config', () => ({
  axiosi: { get: vi.fn() },
}));

const TestConsumer = () => {
  const { collections, products, fetchCollectionsByStoreId, fetchProductsInCollection } = useStorefrontCollections();
  return (
    <div>
      <span data-testid="collections">{collections.length}</span>
      <span data-testid="products">{products.length}</span>
      <button onClick={() => fetchCollectionsByStoreId('s1')}>FetchCollections</button>
      <button onClick={() => fetchProductsInCollection('c1')}>FetchProducts</button>
    </div>
  );
};

describe('StorefrontCollectionsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchCollectionsByStoreId sets collections', async () => {
    const { axiosi } = await import('../config/axios.config');
    (axiosi.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: [{ _id: 'c1', title: 'Collection 1', urlHandle: 'c1' }] },
    });

    render(
      <StorefrontCollectionsProvider>
        <TestConsumer />
      </StorefrontCollectionsProvider>
    );

    await userEvent.click(screen.getByText('FetchCollections'));

    await waitFor(() => {
      expect(screen.getByTestId('collections')).toHaveTextContent('1');
    });
  });
});
