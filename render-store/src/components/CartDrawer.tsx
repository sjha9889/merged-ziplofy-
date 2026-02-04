import React, { useEffect, useMemo, useState } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { storeFrontMeta } = useStorefront();
  const { user, checkAuth } = useStorefrontAuth();
  const { items, getCartByCustomerId, updateCartEntry, deleteCartEntry, clear } = useStorefrontCart();
  const { addresses, fetchCustomerAddressesByCustomerId } = useCustomerAddresses();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'cod' | 'other'>('cod');

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!open) return;
    if (user?._id) getCartByCustomerId(user._id).catch(() => {});
    if (user?._id) fetchCustomerAddressesByCustomerId(user._id).catch(() => {});
  }, [open, user?._id]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      return sum + ((pv?.price ?? 0) * it.quantity);
    }, 0);
  }, [items]);

  const shippingCost = 0;
  const tax = 0;
  const finalTotal = useMemo(() => Math.max(0, subtotal), [subtotal]);

  const handleCheckoutClick = () => {
    if (!user || addresses.length === 0) { onClose(); return; }
    if (user.defaultAddress) setSelectedShippingAddressId(user.defaultAddress);
    else if (addresses.length > 0) setSelectedShippingAddressId(addresses[0]._id);
    setCheckoutDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddressId || !user?._id) return;
    try {
      const orderItems = items.map((item) => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        const price = pv?.price ?? 0;
        return { productVariantId: typeof item.productVariantId === 'object' ? item.productVariantId._id : item.productVariantId, quantity: item.quantity, price, total: price * item.quantity };
      });
      if (!storeFrontMeta?.storeId) throw new Error('Store ID is required');
      await createOrder({
        storeId: storeFrontMeta.storeId,
        shippingAddressId: selectedShippingAddressId,
        billingAddressId: selectedBillingAddressId || undefined,
        items: orderItems,
        paymentMethod,
        subtotal,
        tax,
        shippingCost,
        total: finalTotal + shippingCost + tax,
      });
      setCheckoutDialogOpen(false);
      await Promise.all(items.map(item => deleteCartEntry(item._id).catch(() => {})));
      clear();
    } catch (error) { console.error('Failed to create order:', error); }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="Close cart"
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <div className="text-lg font-semibold text-gray-900">Your Cart</div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="flex h-[calc(100%-64px)] flex-col p-4">
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="text-base font-semibold text-gray-900">Your cart is empty</div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {items.map((it) => {
                    const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
                    const image = pv?.images?.[0];
                    const title = pv?.sku || 'Product';
                    const price = pv?.price ?? 0;
                    return (
                      <div key={it._id} className="rounded-2xl border border-gray-200 p-3">
                        <div className="flex gap-3">
                          <img
                            src={image || 'https://via.placeholder.com/96'}
                            alt={title}
                            className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-gray-900" title={title}>
                              {title}
                            </div>
                            {pv?.optionValues && (
                              <div className="mt-1 text-xs text-gray-600">
                                {Object.entries(pv.optionValues).map(([k, v]) => `${k}: ${v}`).join(', ')}
                              </div>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm font-semibold text-gray-900">
                                ${((price / 100) * it.quantity).toFixed(2)}
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteCartEntry(it._id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                                aria-label="Remove"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50"
                                onClick={() => updateCartEntry({ id: it._id, quantity: Math.max(1, it.quantity - 1) })}
                                aria-label="Decrease quantity"
                              >
                                <FiMinus />
                              </button>
                              <div className="w-8 text-center text-sm font-medium text-gray-900">{it.quantity}</div>
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50"
                                onClick={() => updateCartEntry({ id: it._id, quantity: it.quantity + 1 })}
                                aria-label="Increase quantity"
                              >
                                <FiPlus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${(finalTotal / 100).toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    disabled={items.length === 0}
                  >
                    Pay Now
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {checkoutDialogOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close checkout"
            className="absolute inset-0 bg-black/50"
            onClick={() => setCheckoutDialogOpen(false)}
          />
          <div className="relative mx-auto mt-10 w-[94%] max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-lg font-semibold text-gray-900">Checkout</div>

            <div className="mt-4 grid gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-900">Shipping Address</span>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  value={selectedShippingAddressId}
                  onChange={(e) => setSelectedShippingAddressId(e.target.value)}
                >
                  {addresses.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.firstName} {a.lastName} — {a.address}, {a.city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-900">Billing Address (optional)</span>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  value={selectedBillingAddressId}
                  onChange={(e) => setSelectedBillingAddressId(e.target.value)}
                >
                  <option value="">Same as shipping</option>
                  {addresses.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.firstName} {a.lastName} — {a.address}, {a.city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-900">Payment Method</span>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">${(shippingCost / 100).toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="mt-1 flex items-center justify-between text-sm text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold text-gray-900">${(tax / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${((finalTotal + shippingCost + tax) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCheckoutDialogOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedShippingAddressId || orderLoading}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
