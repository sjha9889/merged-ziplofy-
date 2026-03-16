import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontProfilePage from './StorefrontProfilePage';

vi.mock('../components/StorefrontNavbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({
    user: {
      _id: 'u1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@test.com',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      agreedToMarketingEmails: false,
      agreedToSmsMarketing: false,
    },
    updateUser: vi.fn(),
    loading: false,
    logout: vi.fn(),
  }),
}));
vi.mock('../contexts/customer-address-storefront.context', () => ({
  useCustomerAddresses: () => ({
    addresses: [],
    loading: false,
    error: null,
    fetchCustomerAddressesByCustomerId: vi.fn(),
    addCustomerAddress: vi.fn(),
    updateCustomerAddress: vi.fn(),
    deleteCustomerAddress: vi.fn(),
  }),
}));
vi.mock('../contexts/storefront-country.context', () => ({
  useStorefrontCountries: () => ({ countries: [], getCountries: vi.fn(), loading: false }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontProfilePage', () => {
  it('renders profile with user name', () => {
    render(<StorefrontProfilePage />, { wrapper: Wrapper });
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
  });

  it('renders sidebar tabs', () => {
    render(<StorefrontProfilePage />, { wrapper: Wrapper });
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Addresses')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('switches to addresses tab', async () => {
    render(<StorefrontProfilePage />, { wrapper: Wrapper });
    await userEvent.click(screen.getByText('Addresses'));
    expect(screen.getByText('Add Address')).toBeInTheDocument();
  });
});
