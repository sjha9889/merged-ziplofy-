import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AuthPopup from './AuthPopup';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

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

  it('calls onClose when Login clicked and navigates', async () => {
    const onClose = vi.fn();
    const navigate = vi.fn();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigate);

    render(<AuthPopup open onClose={onClose} />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(onClose).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/auth/login');
  });

  it('calls onClose when Sign Up clicked and navigates', async () => {
    const onClose = vi.fn();
    const navigate = vi.fn();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigate);

    render(<AuthPopup open onClose={onClose} />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(onClose).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/auth/signup');
  });
});
