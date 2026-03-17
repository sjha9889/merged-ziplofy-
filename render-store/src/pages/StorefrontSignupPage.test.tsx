import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontSignupPage from './StorefrontSignupPage';

const mockSignup = vi.fn();
vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ signup: mockSignup, loading: false }),
}));
vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({ storeFrontMeta: { storeId: 's1', name: 'Store' } }),
}));
vi.mock('../components/SlantedImageCarouselWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('StorefrontSignupPage', () => {
  beforeEach(() => mockSignup.mockClear());

  it('renders signup form', () => {
    render(<StorefrontSignupPage />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows error when submitting without terms', async () => {
    const user = userEvent.setup({ delay: null });
    mockSignup.mockClear();
    render(<StorefrontSignupPage />, { wrapper: Wrapper });
    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'j@b.com');
    await user.type(screen.getByPlaceholderText('Create a strong password'), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(mockSignup).not.toHaveBeenCalled();
    expect(await screen.findByText(/please agree to the terms and conditions/i)).toBeInTheDocument();
  });
});
