import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontMyOrdersPage from './StorefrontMyOrdersPage';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';

const mockNavigate = vi.fn();
const mockCheckAuth = vi.fn();
const mockGetOrdersByCustomerId = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../components/StorefrontNavbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: vi.fn(),
}));
vi.mock('../contexts/storefront-order.context', () => ({
  useStorefrontOrder: vi.fn(),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontMyOrdersPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCheckAuth.mockClear();
    mockGetOrdersByCustomerId.mockClear();
    vi.mocked(useStorefrontAuth).mockReturnValue({
      user: null,
      checkAuth: mockCheckAuth,
    } as any);
    vi.mocked(useStorefrontOrder).mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      getOrdersByCustomerId: mockGetOrdersByCustomerId,
    } as any);
  });

  it('renders My Orders heading', () => {
    render(<StorefrontMyOrdersPage />, { wrapper: Wrapper });
    expect(screen.getByText('My Orders')).toBeInTheDocument();
  });

  it('shows login prompt when user is not logged in', () => {
    render(<StorefrontMyOrdersPage />, { wrapper: Wrapper });
    expect(screen.getByText('Please Login')).toBeInTheDocument();
    expect(screen.getByText('Login to view your order history')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('navigates to login when Login is clicked', async () => {
    render(<StorefrontMyOrdersPage />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('shows order list when user has orders', () => {
    vi.mocked(useStorefrontAuth).mockReturnValue({
      user: { _id: 'u1' } as any,
      checkAuth: mockCheckAuth,
    } as any);
    mockGetOrdersByCustomerId.mockResolvedValue(undefined);
    vi.mocked(useStorefrontOrder).mockReturnValue({
      orders: [
        {
          _id: 'ord12345678',
          orderDate: '2024-01-15T10:00:00Z',
          status: 'delivered',
          paymentStatus: 'paid',
          total: 199900,
          subtotal: 180000,
          tax: 10000,
          shippingCost: 9900,
          paymentMethod: 'cod',
          items: [],
          notes: null,
        },
      ],
      loading: false,
      error: null,
      getOrdersByCustomerId: mockGetOrdersByCustomerId,
    } as any);
    render(<StorefrontMyOrdersPage />, { wrapper: Wrapper });
    expect(screen.getByText(/12345678/)).toBeInTheDocument();
  });

  it('shows empty state when user has no orders', () => {
    mockGetOrdersByCustomerId.mockResolvedValue(undefined);
    vi.mocked(useStorefrontAuth).mockReturnValue({
      user: { _id: 'u1' } as any,
      checkAuth: mockCheckAuth,
    } as any);
    vi.mocked(useStorefrontOrder).mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      getOrdersByCustomerId: mockGetOrdersByCustomerId,
    } as any);
    render(<StorefrontMyOrdersPage />, { wrapper: Wrapper });
    expect(screen.getByText('No orders yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start shopping/i })).toBeInTheDocument();
  });
});
