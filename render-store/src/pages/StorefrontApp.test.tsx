import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StorefrontApp from './StorefrontApp';

vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({
    storeFrontMeta: { storeId: 's1', name: 'Test Store', description: 'Store desc' },
  }),
}));
vi.mock('../contexts/product.context', () => ({
  useStorefrontProducts: () => ({
    products: [
      {
        _id: 'p1',
        title: 'Product One',
        price: 99900,
        compareAtPrice: null,
        imageUrls: [],
        vendor: { name: 'Vendor' },
        productDiscount: null,
      },
    ],
    loading: false,
    pagination: { page: 1, limit: 12, hasNext: false },
    orderDiscount: null,
    fetchProductsByStoreId: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({
    user: null,
    logout: vi.fn(),
    checkAuth: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({
    getCartByCustomerId: vi.fn().mockResolvedValue(undefined),
    createCartEntry: vi.fn().mockResolvedValue(undefined),
  }),
}));
vi.mock('../contexts/storefront-collections.context', () => ({
  useStorefrontCollections: () => ({
    collections: [],
    loading: false,
    fetchCollectionsByStoreId: vi.fn(),
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

describe('StorefrontApp', () => {
  it('renders store name', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByRole('heading', { name: /test store/i })).toBeInTheDocument();
  });

  it('renders store description', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByText('Store desc')).toBeInTheDocument();
  });

  it('renders product from API', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByText('Product One')).toBeInTheDocument();
  });

  it('links to products and collections', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByRole('link', { name: /browse products/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /collections/i })).toHaveAttribute('href', '/collection');
  });
});
