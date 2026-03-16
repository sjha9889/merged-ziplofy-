import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontForgotPasswordPage from './StorefrontForgotPasswordPage';

const mockForgotPassword = vi.fn();
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ forgotPassword: mockForgotPassword, loading: false }),
}));
vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({ storeFrontMeta: { storeId: 's1' } }),
}));
vi.mock('../components/SlantedImageCarouselWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontForgotPasswordPage', () => {
  beforeEach(() => mockForgotPassword.mockClear());

  it('renders forgot password form', () => {
    render(<StorefrontForgotPasswordPage />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('calls forgotPassword on submit', async () => {
    mockForgotPassword.mockResolvedValue(undefined);
    render(<StorefrontForgotPasswordPage />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText(/enter your email/i), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(mockForgotPassword).toHaveBeenCalledWith({ email: 'a@b.com', storeId: 's1' });
  });
});
