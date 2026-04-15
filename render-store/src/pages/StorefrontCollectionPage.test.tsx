import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StorefrontCollectionPage from './StorefrontCollectionPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: vi.fn(() => ({ collectionId: 'c1', urlHandle: 'summer' })) };
});

vi.mock('../components/StorefrontNavbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../contexts/store.context', () => ({ useStorefront: () => ({ storeFrontMeta: { storeId: 's1' } }) }));
vi.mock('../contexts/storefront-collections.context', () => ({
  useStorefrontCollections: () => ({
    collections: [{ _id: 'c1', title: 'Summer Sale', handle: 'summer' }],
    products: [{ _id: 'p1', title: 'Shirt', price: 99900 }],
    orderDiscount: null,
    loading: false,
    fetchCollectionsByStoreId: vi.fn().mockResolvedValue(undefined),
    fetchProductsInCollection: vi.fn().mockResolvedValue(undefined),
  }),
}));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({ createCartEntry: vi.fn() }),
}));
vi.mock('../contexts/product-variant.context', () => ({
  useStorefrontProductVariants: () => ({ fetchVariantsByProductId: vi.fn().mockResolvedValue([]) }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontCollectionPage', () => {
  it('renders collection products', () => {
    render(<StorefrontCollectionPage />, { wrapper: Wrapper });
    expect(screen.getByText('Shirt')).toBeInTheDocument();
  });

  it('renders navbar', () => {
    render(<StorefrontCollectionPage />, { wrapper: Wrapper });
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });
});
