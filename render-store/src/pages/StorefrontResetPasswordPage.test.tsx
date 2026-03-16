import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StorefrontResetPasswordPage from './StorefrontResetPasswordPage';

const mockNavigate = vi.fn();
const mockResetPassword = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({ resetPassword: mockResetPassword, loading: false }),
}));
vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({ storeFrontMeta: { storeId: 's1' } }),
}));

const ResetWrapper = ({ children, hasToken }: { children: React.ReactNode; hasToken: boolean }) => (
  <MemoryRouter initialEntries={[hasToken ? '/auth/reset-password?reset-token=abc123' : '/auth/reset-password']}>
    <Routes>
      <Route path="/auth/reset-password" element={children} />
    </Routes>
  </MemoryRouter>
);

describe('StorefrontResetPasswordPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockResetPassword.mockClear();
  });

  it('shows loading when no reset token in URL', () => {
    render(<StorefrontResetPasswordPage />, { wrapper: ({ children }) => <ResetWrapper hasToken={false}>{children}</ResetWrapper> });
    expect(screen.getByText(/validating reset token/i)).toBeInTheDocument();
  });

  it('renders reset form when token is present', async () => {
    render(<StorefrontResetPasswordPage />, { wrapper: ({ children }) => <ResetWrapper hasToken>{children}</ResetWrapper> });
    expect(await screen.findByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup({ delay: null });
    render(<StorefrontResetPasswordPage />, { wrapper: ({ children }) => <ResetWrapper hasToken>{children}</ResetWrapper> });

    const newPw = await screen.findByLabelText(/password must be at least 6 characters/i, {}, { timeout: 3000 });
    await user.type(newPw, '12345');
    await user.type(screen.getByLabelText(/confirm new password/i), '12345');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getAllByText(/password must be at least 6 characters long/i).length).toBeGreaterThanOrEqual(1);
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup({ delay: null });
    render(<StorefrontResetPasswordPage />, { wrapper: ({ children }) => <ResetWrapper hasToken>{children}</ResetWrapper> });

    const newPw = await screen.findByLabelText(/password must be at least 6 characters/i, {}, { timeout: 3000 });
    await user.type(newPw, 'password1');
    await user.type(screen.getByLabelText(/confirm new password/i), 'password2');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('calls resetPassword on valid submit', async () => {
    const user = userEvent.setup({ delay: null });
    mockResetPassword.mockResolvedValue(undefined);
    render(<StorefrontResetPasswordPage />, { wrapper: ({ children }) => <ResetWrapper hasToken>{children}</ResetWrapper> });

    const newPw = await screen.findByLabelText(/password must be at least 6 characters/i, {}, { timeout: 3000 });
    await user.type(newPw, 'newpass123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'newpass123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(mockResetPassword).toHaveBeenCalledWith({
      token: 'abc123',
      newPassword: 'newpass123',
      storeId: 's1',
    });
  });
});
