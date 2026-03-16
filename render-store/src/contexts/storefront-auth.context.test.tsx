import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorefrontAuthProvider, useStorefrontAuth } from './storefront-auth.context';

vi.mock('../config/axios.config', () => ({
  axiosi: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, login, logout, signup, checkAuth } = useStorefrontAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <button onClick={() => login({ storeId: 's1', email: 'a@b.com', password: 'p' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => signup({ storeId: 's1', firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'p' })}>Signup</button>
      <button onClick={() => checkAuth()}>Check</button>
    </div>
  );
};

describe('StorefrontAuthProvider', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    try { localStorage?.removeItem?.('accessToken'); } catch { /* ignore */ }
    const { axiosi } = await import('../config/axios.config');
    (axiosi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { success: true } });
    (axiosi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { success: false } });
  });

  it('login sets user and token', async () => {
    const user = render(
      <StorefrontAuthProvider>
        <TestConsumer />
      </StorefrontAuthProvider>
    );
    const { axiosi } = await import('../config/axios.config');
    (axiosi.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true, data: { _id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B' }, token: 't1' },
    });

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('a@b.com');
    });
    expect(localStorage.getItem('accessToken')).toBe('t1');
  });

  it('logout clears user and token', async () => {
    localStorage.setItem('accessToken', 't1');
    const { axiosi } = await import('../config/axios.config');
    (axiosi.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { success: true, data: { _id: '1', email: 'a@b.com' }, token: 't1' },
    });

    render(
      <StorefrontAuthProvider>
        <TestConsumer />
      </StorefrontAuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('a@b.com'));

    await userEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
