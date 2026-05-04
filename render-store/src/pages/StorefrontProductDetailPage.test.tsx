import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StorefrontProductDetailPage from './StorefrontProductDetailPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: vi.fn(() => ({ id: 'p1' })) };
});

vi.mock('../components/StorefrontNavbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/AuthPopup', () => ({ default: () => null }));
vi.mock('../components/QuickBuyNowCheckoutModal', () => ({
  QuickBuyNowCheckoutModal: () => null,
}));
vi.mock('../contexts/product.context', () => ({
  useStorefrontProducts: () => ({
    products: [],
    productDetail: { _id: 'p1', title: 'Test Product', price: 99900 },
    productDetailLoading: false,
    productDetailError: null,
    fetchProductById: vi.fn(),
    fetchProductsByStoreId: vi.fn().mockResolvedValue(undefined),
    clearProductDetail: vi.fn(),
  }),
}));
vi.mock('../contexts/store.context', () => ({ useStorefront: () => ({ storeFrontMeta: { storeId: 's1' } }) }));
vi.mock('../contexts/product-variant.context', () => ({
  useStorefrontProductVariants: () => ({
    variants: [{ _id: 'v1', productId: 'p1', sku: 'SKU', price: 99900, optionValues: {}, images: [] }],
    loading: false,
    fetchVariantsByProductId: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({ createCartEntry: vi.fn(), getCartByCustomerId: vi.fn() }),
}));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ user: null, checkAuth: vi.fn() }),
}));
vi.mock('../contexts/product-offers.context', () => ({
  useProductOffers: () => ({
    freeShippingOffers: [],
    amountOffOrderOffers: [],
    amountOffProductsOffers: [],
    buyXGetYOffers: [],
    loading: false,
    freeShippingLoading: false,
    amountOffOrderLoading: false,
    amountOffProductsLoading: false,
    buyXGetYLoading: false,
    error: null,
    clear: vi.fn(),
    fetchFreeShippingOffersForProduct: vi.fn(),
    fetchAmountOffOrderOffersForProduct: vi.fn(),
    fetchAmountOffProductsOffersForProduct: vi.fn(),
    fetchBuyXGetYOffersForProduct: vi.fn(),
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontProductDetailPage', () => {
  it('renders product title when detail loaded', () => {
    render(<StorefrontProductDetailPage />, { wrapper: Wrapper });
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders add to cart or buy now', () => {
    render(<StorefrontProductDetailPage />, { wrapper: Wrapper });
    expect(screen.getByText(/add to cart/i) || screen.getByText(/buy now/i) || screen.getByRole('button')).toBeInTheDocument();
  });
});
