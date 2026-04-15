import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StorefrontCartPage from './StorefrontCartPage';

vi.mock('../components/CartDrawer', () => ({
  default: ({ onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="cart-drawer">
      <span>Cart</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('StorefrontCartPage', () => {
  it('renders CartDrawer with open=true', () => {
    render(
      <MemoryRouter>
        <StorefrontCartPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('cart-drawer')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  it('navigates back when Close clicked', async () => {
    render(
      <MemoryRouter>
        <StorefrontCartPage />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText('Close'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
