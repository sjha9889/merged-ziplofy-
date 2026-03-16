import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BxgyChooseItemsModal } from './BxgyChooseItemsModal';

vi.mock('../contexts/storefront-collections.context', () => ({
  useStorefrontCollections: () => ({
    products: [{ _id: 'p1', title: 'Product 1', price: 100, imageUrls: [] }],
    loading: false,
    fetchProductsInCollection: vi.fn().mockResolvedValue(undefined),
  }),
}));
vi.mock('../contexts/product-variant.context', () => ({
  useStorefrontProductVariants: () => ({ fetchVariantsByProductId: vi.fn().mockResolvedValue([]) }),
}));

const discount = {
  id: 'bxgy1',
  method: 'automatic',
  customerGetsAnyItemsFrom: 'specific-collections' as const,
  customerGetsQuantity: 2,
  totalDiscountAmount: 100,
  getsItems: [],
  discountSummary: 'Buy 1 Get 1',
  message: '',
  combinations: { productDiscounts: true, orderDiscounts: true, shippingDiscounts: true },
  discountedValue: 'free' as const,
  getsCollectionIds: ['c1'],
  getsCollectionNames: ['Summer Sale'],
};

describe('BxgyChooseItemsModal', () => {
  it('returns null when closed', () => {
    const { container } = render(
      <BxgyChooseItemsModal open={false} onClose={vi.fn()} discount={discount} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when open with heading and product list', () => {
    render(<BxgyChooseItemsModal open={true} onClose={vi.fn()} discount={discount} onConfirm={vi.fn()} />);
    expect(screen.getByText(/choose up to 2/i)).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('has Cancel and Done buttons', () => {
    render(<BxgyChooseItemsModal open={true} onClose={vi.fn()} discount={discount} onConfirm={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^done$/i })).toBeInTheDocument();
  });

  it('Done button is disabled when nothing selected', () => {
    render(<BxgyChooseItemsModal open={true} onClose={vi.fn()} discount={discount} onConfirm={vi.fn()} />);
    const doneBtn = screen.getByRole('button', { name: /^done$/i });
    expect(doneBtn).toBeDisabled();
  });
});
