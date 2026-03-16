import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontApp from './StorefrontApp';

vi.mock('../components/StorefrontNavbar', () => ({ default: () => <nav data-testid="navbar">Navbar</nav> }));
vi.mock('../components/AuthPopup', () => ({ default: () => null }));
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
vi.mock('../contexts/product-variant.context', () => ({
  useStorefrontProductVariants: () => ({
    fetchVariantsByProductId: vi.fn().mockResolvedValue([{ _id: 'v1', isSynthetic: false }]),
  }),
}));

vi.mock('framer-motion', () => {
  const R = require('react');
  const strip = (p: Record<string, unknown> = {}) => {
    const { whileInView, whileHover, whileTap, animate, initial, transition, layout, layoutId, ...rest } = p;
    return rest;
  };
  const tags = ['div', 'section', 'span', 'button', 'h1', 'h2', 'h3', 'h4', 'p', 'img', 'input', 'footer'];
  const motion = Object.fromEntries(
    tags.map((tag) => [
      tag,
      tag === 'img' ? (props: any) => R.createElement(tag, strip(props))
        : ({ children, ...props }: any) => R.createElement(tag, strip(props), children),
    ])
  );
  return { motion };
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontApp', () => {
  it('renders store name in hero', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByRole('heading', { name: /test store/i })).toBeInTheDocument();
  });

  it('renders navbar', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Featured Products section', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
  });

  it('renders product when products loaded', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByText('Product One')).toBeInTheDocument();
  });

  it('renders Shop Now button', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /shop now/i })).toBeInTheDocument();
  });

  it('renders Why Choose Us section', () => {
    render(<StorefrontApp />, { wrapper: Wrapper });
    expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
  });
});
