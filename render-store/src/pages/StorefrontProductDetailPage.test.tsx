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
vi.mock('../contexts/product.context', () => ({
  useStorefrontProducts: () => ({
    products: [],
    productDetail: { _id: 'p1', title: 'Test Product', price: 99900 },
    productDetailLoading: false,
    productDetailError: null,
    fetchProductById: vi.fn(),
    clearProductDetail: vi.fn(),
  }),
}));
vi.mock('../contexts/store.context', () => ({ useStorefront: () => ({ storeFrontMeta: { storeId: 's1' } }) }));
vi.mock('../contexts/product-variant.context', () => ({
  useStorefrontProductVariants: () => ({
    variants: [{ _id: 'v1', price: 99900, optionValues: {} }],
    loading: false,
    fetchVariantsByProductId: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({ createCartEntry: vi.fn(), getCartByCustomerId: vi.fn() }),
}));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ user: null, checkAuth: vi.fn(), login: vi.fn(), signup: vi.fn() }),
}));
vi.mock('../contexts/customer-address-storefront.context', () => ({
  useCustomerAddresses: () => ({ addresses: [], fetchCustomerAddressesByCustomerId: vi.fn(), addCustomerAddress: vi.fn() }),
}));
vi.mock('../contexts/storefront-order.context', () => ({ useStorefrontOrder: () => ({ createOrder: vi.fn(), loading: false }) }));
vi.mock('../contexts/product-offers.context', () => ({
  useProductOffers: () => ({
    freeShippingOffers: [],
    amountOffOrderOffers: [],
    amountOffProductsOffers: [],
    buyXGetYOffers: [],
    loading: false,
    fetchFreeShippingOffersForProduct: vi.fn(),
    fetchAmountOffOrderOffersForProduct: vi.fn(),
    fetchAmountOffProductsOffersForProduct: vi.fn(),
    fetchBuyXGetYOffersForProduct: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-country.context', () => ({
  useStorefrontCountries: () => ({ countries: [], getCountries: vi.fn() }),
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
