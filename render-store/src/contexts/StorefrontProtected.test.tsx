import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StorefrontProtected from './StorefrontProtected';

const mockUseStorefrontAuth = vi.fn();
vi.mock('./storefront-auth.context', () => ({
  useStorefrontAuth: () => mockUseStorefrontAuth(),
}));

describe('StorefrontProtected', () => {
  beforeEach(() => {
    mockUseStorefrontAuth.mockReset();
  });

  it('renders children when user exists', () => {
    mockUseStorefrontAuth.mockReturnValue({ user: { _id: '1' } });

    render(
      <MemoryRouter>
        <StorefrontProtected>
          <div>Protected Content</div>
        </StorefrontProtected>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is null', () => {
    mockUseStorefrontAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={
            <StorefrontProtected redirectTo="/auth/login">
              <div>Protected</div>
            </StorefrontProtected>
          } />
          <Route path="/auth/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
