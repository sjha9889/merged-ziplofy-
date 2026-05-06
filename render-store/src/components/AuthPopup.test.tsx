import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AuthPopup from './AuthPopup';

const loginMock = vi.fn().mockResolvedValue({});
const signupMock = vi.fn().mockResolvedValue({});
const forgotPasswordMock = vi.fn().mockResolvedValue({});

vi.mock('../contexts/store.context', () => ({
  useStorefront: () => ({
    storeFrontMeta: { storeId: 'store-1', name: 'Demo Store' },
  }),
}));

vi.mock('../contexts/storefront-auth.context', () => ({
  useStorefrontAuth: () => ({
    login: loginMock,
    signup: signupMock,
    forgotPassword: forgotPasswordMock,
    loading: false,
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('AuthPopup', () => {
  it('returns null when closed', () => {
    const { container } = render(<AuthPopup open={false} onClose={() => {}} />, { wrapper: Wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('renders title and buttons when open', () => {
    render(<AuthPopup open onClose={() => {}} />, { wrapper: Wrapper });
    expect(screen.getByText(/Want to add items to cart/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('submits login from within modal', async () => {
    const onClose = vi.fn();
    const onAuthenticated = vi.fn();

    render(<AuthPopup open onClose={onClose} onAuthenticated={onAuthenticated} />, {
      wrapper: Wrapper,
    });
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));
    await userEvent.type(screen.getByPlaceholderText(/you@example.com/i), 'demo@test.com');
    await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /^Sign in$/i }));

    expect(loginMock).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(onAuthenticated).toHaveBeenCalled();
  });

  it('does not submit signup when password is too short', async () => {
    signupMock.mockClear();
    render(<AuthPopup open onClose={() => {}} />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await userEvent.type(screen.getByPlaceholderText(/^John$/i), 'Demo');
    await userEvent.type(screen.getByPlaceholderText(/^Doe$/i), 'User');
    await userEvent.type(screen.getByPlaceholderText(/you@example.com/i), 'demo@test.com');
    await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'short');
    await userEvent.click(screen.getByRole('button', { name: /^Sign up$/i }));
    expect(signupMock).not.toHaveBeenCalled();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('submits signup from within modal', async () => {
    const onClose = vi.fn();
    const onAuthenticated = vi.fn();

    render(<AuthPopup open onClose={onClose} onAuthenticated={onAuthenticated} />, {
      wrapper: Wrapper,
    });
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await userEvent.type(screen.getByPlaceholderText(/^John$/i), 'Demo');
    await userEvent.type(screen.getByPlaceholderText(/^Doe$/i), 'User');
    await userEvent.type(screen.getByPlaceholderText(/you@example.com/i), 'demo@test.com');
    await userEvent.type(screen.getByPlaceholderText(/^Password$/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /^Sign up$/i }));

    expect(signupMock).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(onAuthenticated).toHaveBeenCalled();
  });

  it('submits forgot password from within modal', async () => {
    const onClose = vi.fn();

    render(<AuthPopup open onClose={onClose} />, {
      wrapper: Wrapper,
    });
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));
    await userEvent.click(screen.getByRole('button', { name: /Forgot password\?/i }));
    await userEvent.type(screen.getByPlaceholderText(/you@example.com/i), 'demo@test.com');
    await userEvent.click(screen.getByRole('button', { name: /Send reset link/i }));

    expect(forgotPasswordMock).toHaveBeenCalled();
  });
});
