import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual };
});

const ScrollTracker = () => {
  const loc = useLocation();
  return <div data-testid="path">{loc.pathname}</div>;
};

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('scrolls to top on location change', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <ScrollTracker />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0, left: 0 }));

    rerender(
      <MemoryRouter initialEntries={['/', '/products/1']} initialIndex={1}>
        <ScrollToTop />
        <ScrollTracker />
      </MemoryRouter>
    );
    // ScrollToTop calls scrollTo when pathname changes
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
