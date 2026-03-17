import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontLoginPage from './StorefrontLoginPage';

vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({ storeFrontMeta: { storeId: 's1', name: 'Store' } }),
}));

const mockLogin = vi.fn();
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ login: mockLogin, loading: false }),
}));

vi.mock('../components/SlantedImageCarouselWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontLoginPage', () => {
  beforeEach(() => mockLogin.mockClear());

  it('renders login form', () => {
    render(<StorefrontLoginPage />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls login on submit with email and password', async () => {
    const user = userEvent.setup({ delay: null });
    mockLogin.mockResolvedValue(undefined);
    render(<StorefrontLoginPage />, { wrapper: Wrapper });

    await user.type(screen.getByPlaceholderText(/enter your email/i), 'a@b.com');
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'pass123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({ storeId: 's1', email: 'a@b.com', password: 'pass123' });
  });

  it('has link to forgot password', () => {
    render(<StorefrontLoginPage />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
  });
});
