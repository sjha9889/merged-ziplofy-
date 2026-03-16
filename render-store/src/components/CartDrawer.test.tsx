import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartDrawer from './CartDrawer';

vi.mock('../contexts/store.context', () => ({ useStorefront: () => ({ storeFrontMeta: { name: 'Store' } }) }));
vi.mock('../contexts/storefront-auth.context', () => ({ useStorefrontAuth: () => ({ user: null, checkAuth: vi.fn() }) }));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({
    items: [],
    guestItems: [],
    isGuest: true,
    getCartByCustomerId: vi.fn(),
    updateCartEntry: vi.fn(),
    deleteCartEntry: vi.fn(),
    clear: vi.fn(),
  }),
}));
vi.mock('../contexts/customer-address-storefront.context', () => ({
  useCustomerAddresses: () => ({ addresses: [], fetchCustomerAddressesByCustomerId: vi.fn(), addCustomerAddress: vi.fn(), loading: false }),
}));
vi.mock('../contexts/storefront-order.context', () => ({ useStorefrontOrder: () => ({ createOrder: vi.fn(), loading: false }) }));
vi.mock('../contexts/storefront-free-shipping.context', () => ({
  useFreeShipping: () => ({
    eligibleDiscounts: [],
    discountCodeResult: null,
    appliedAutomaticDiscount: null,
    checkEligibleFreeShippingDiscounts: vi.fn(),
    applyAutomaticDiscount: vi.fn(),
    clearAppliedAutomaticDiscount: vi.fn(),
  }),
}));
vi.mock('../contexts/amount-off-order.context', () => ({
  useAmountOffOrder: () => ({
    eligibleDiscounts: [],
    discountCodeResult: null,
    appliedAutomaticDiscount: null,
    fetchEligibleDiscounts: vi.fn(),
    applyAutomaticDiscount: vi.fn(),
    clearAppliedAutomaticDiscount: vi.fn(),
  }),
}));
vi.mock('../contexts/amount-off-product.context', () => ({
  useAmountOffProduct: () => ({
    eligibleDiscounts: [],
    discountCodeResult: null,
    appliedAutomaticDiscount: null,
    fetchEligibleDiscounts: vi.fn(),
    applyAutomaticDiscount: vi.fn(),
    clearAppliedAutomaticDiscount: vi.fn(),
  }),
}));
vi.mock('../contexts/buy-x-get-y.context', () => ({
  useBuyXGetY: () => ({
    eligibleDiscounts: [],
    discountCodeResult: null,
    appliedAutomaticDiscount: null,
    selectedGetsItems: null,
    setSelectedGetsItems: vi.fn(),
    fetchEligibleDiscounts: vi.fn(),
    applyAutomaticDiscount: vi.fn(),
    clearAppliedAutomaticDiscount: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-country.context', () => ({
  useStorefrontCountries: () => ({ countries: [], getCountries: vi.fn(), loading: false }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('CartDrawer', () => {
  it('renders nothing when closed', () => {
    render(<CartDrawer open={false} onClose={vi.fn()} />, { wrapper: Wrapper });
    expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
  });

  it('renders cart when open', () => {
    render(<CartDrawer open={true} onClose={vi.fn()} />, { wrapper: Wrapper });
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  it('shows empty cart message when no items', () => {
    render(<CartDrawer open={true} onClose={vi.fn()} />, { wrapper: Wrapper });
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('calls onClose when Close button clicked', async () => {
    const onClose = vi.fn();
    render(<CartDrawer open={true} onClose={onClose} />, { wrapper: Wrapper });
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows Continue Shopping when cart empty', () => {
    render(<CartDrawer open={true} onClose={vi.fn()} />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
  });
});
