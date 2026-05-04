import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontNavbar from './StorefrontNavbar';

vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({ storeFrontMeta: { name: 'TestStore' } }),
}));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ user: null, logout: vi.fn() }),
}));
vi.mock('../contexts/storefront-cart.context', () => ({
  useStorefrontCart: () => ({ items: [], guestItems: [], isGuest: true }),
}));
vi.mock('./CartDrawer', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="cart-drawer"><button onClick={onClose}>Close</button></div> : null,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontNavbar', () => {
  it('renders store name', () => {
    render(<StorefrontNavbar />, { wrapper: Wrapper });
    expect(screen.getByText('TestStore')).toBeInTheDocument();
  });

  it('shows cart button', () => {
    render(<StorefrontNavbar />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('shows search input when showSearch', () => {
    const onSearchChange = vi.fn();
    render(<StorefrontNavbar showSearch searchValue="" onSearchChange={onSearchChange} />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
  });

  it('shows sign in and create account when not logged in', async () => {
    render(<StorefrontNavbar />, { wrapper: Wrapper });
    const accountBtn = screen.getByRole('button', { name: /account menu/i });
    await userEvent.click(accountBtn);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
