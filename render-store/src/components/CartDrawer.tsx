import React, { useEffect, useMemo, useState } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiX, FiArrowLeft, FiLock, FiTruck, FiMapPin, FiTag } from 'react-icons/fi';
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
  const [selectedBillingAddressId] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!open) return;
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
      fetchCustomerAddressesByCustomerId(user._id).catch(() => {});
    }
  }, [open, user?._id, getCartByCustomerId, fetchCustomerAddressesByCustomerId]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      return sum + ((pv?.price ?? 0) * it.quantity);
    }, 0);
  }, [items]);

  const shippingCost = 0;
  const tax = 0;
  const finalTotal = useMemo(() => Math.max(0, subtotal), [subtotal]);
  
  // Calculate total savings and item count
  const totalSavings = useMemo(() => {
    return items.reduce((sum, it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      if (pv?.compareAtPrice && pv.compareAtPrice > pv.price) {
        return sum + ((pv.compareAtPrice - pv.price) * it.quantity);
      }
      return sum;
    }, 0);
  }, [items]);
  
  const totalItems = useMemo(() => {
    return items.reduce((sum, it) => sum + it.quantity, 0);
  }, [items]);

  const handleCheckoutClick = () => {
    if (!user) {
      // User not logged in - close cart and they should login first
      onClose();
      return;
    }
    // Open checkout modal even if no addresses - user can see what's needed
    if (user.defaultAddress) {
      setSelectedShippingAddressId(user.defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedShippingAddressId(addresses[0]._id);
    }
    setCheckoutDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddressId || !user?._id) {
      console.error('Cannot place order: missing shipping address or user');
      return;
    }
    if (items.length === 0) {
      console.error('Cannot place order: cart is empty');
      return;
    }
    try {
      const orderItems = items.map((item) => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        const price = pv?.price ?? 0;
        return { 
          productVariantId: typeof item.productVariantId === 'object' ? item.productVariantId._id : item.productVariantId, 
          quantity: item.quantity, 
          price, 
          total: price * item.quantity 
        };
      });
      if (!storeFrontMeta?.storeId) {
        throw new Error('Store ID is required');
      }
      console.log('Placing order with items:', orderItems);
      await createOrder({
        storeId: storeFrontMeta.storeId,
        shippingAddressId: selectedShippingAddressId,
        billingAddressId: selectedBillingAddressId || undefined,
        items: orderItems,
        paymentMethod: 'cod',
        subtotal,
        tax,
        shippingCost,
        total: finalTotal + shippingCost + tax,
      });
      console.log('Order placed successfully');
      setCheckoutDialogOpen(false);
      await Promise.all(items.map(item => deleteCartEntry(item._id).catch(() => {})));
      clear();
      onClose(); // Close the cart drawer after successful order
    } catch (error) { 
      console.error('Failed to create order:', error);
      // You might want to show a toast notification here
    }
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

        <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#fefcf8] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#e8e0d5] px-4 py-4">
            <div className="text-lg font-semibold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>Your Cart</div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#f5f1e8] text-[#0c100c] transition-colors"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="flex h-[calc(100%-64px)] flex-col p-4">
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="text-base font-semibold text-[#0c100c]">Your cart is empty</div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] px-4 py-2 text-sm font-semibold text-[#0c100c] hover:shadow-lg transition-all"
                    style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
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
                      <div key={it._id} className="rounded-2xl border border-[#e8e0d5] p-3">
                        <div className="flex gap-3">
                          <img
                            src={image || 'https://via.placeholder.com/96'}
                            alt={title}
                            className="h-20 w-20 flex-shrink-0 rounded-xl bg-[#f5f1e8] object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-[#0c100c]" title={title}>
                              {title}
                            </div>
                            {pv?.optionValues && (
                              <div className="mt-1 text-xs text-[#2b1e1e]">
                                {Object.entries(pv.optionValues).map(([k, v]) => `${k}: ${v}`).join(', ')}
                              </div>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm font-semibold text-[#0c100c]">
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
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e0d5] hover:bg-[#f5f1e8]"
                                onClick={() => updateCartEntry({ id: it._id, quantity: Math.max(1, it.quantity - 1) })}
                                aria-label="Decrease quantity"
                              >
                                <FiMinus />
                              </button>
                              <div className="w-8 text-center text-sm font-medium text-[#0c100c]">{it.quantity}</div>
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e0d5] hover:bg-[#f5f1e8]"
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

                <div className="mt-4 rounded-2xl border border-[#e8e0d5] p-4">
                  <div className="flex items-center justify-between text-sm text-[#2b1e1e]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#0c100c]">${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base">
                    <span className="font-semibold text-[#0c100c]">Total</span>
                    <span className="font-bold text-[#0c100c]">${(finalTotal / 100).toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] px-4 py-2 text-sm font-semibold text-[#0c100c] hover:shadow-lg disabled:opacity-50 transition-all"
                    disabled={items.length === 0}
                    style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
                  >
                    Pay Now
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Quick Checkout Popup (Pay Now from Cart) */}
      {checkoutDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setCheckoutDialogOpen(false)}>
          <div className="bg-[#fefcf8] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d5]">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setCheckoutDialogOpen(false)} className="p-1 hover:bg-[#f5f1e8] rounded-lg transition-colors">
                  <FiArrowLeft className="w-5 h-5 text-[#0c100c]" />
                </button>
                <h2 className="text-lg font-semibold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>{storeFrontMeta?.name || 'Store'}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#2b1e1e]">100% Secured Payment</span>
                <FiLock className="w-4 h-4 text-[#2b1e1e]" />
              </div>
            </div>
            <div className="p-0">
              <div className="px-6 py-3 text-[#0c100c] font-bold text-sm">DELIVERY DETAILS</div>

              {/* Order Summary */}
              <div className="px-6 pb-3">
                <div className="p-4 rounded-lg border border-[#e8e0d5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiTruck className="w-5 h-5 text-[#d4af37]" />
                      <div>
                        <h3 className="font-semibold text-[#0c100c]">Order Summary</h3>
                        {totalSavings > 0 && (
                          <span className="inline-block px-2 py-1 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs mt-1">
                            ${(totalSavings / 100).toFixed(2)} saved so far
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#2b1e1e]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                      <div className="flex items-center gap-2">
                        {totalSavings > 0 && (
                          <span className="text-sm text-[#2b1e1e]/60 line-through">
                            ${((subtotal + totalSavings) / 100).toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#d4af37]">${(subtotal / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="px-6 pb-3">
                <div className="p-4 rounded-lg border border-[#e8e0d5]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="pr-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMapPin className="w-5 h-5 text-[#d4af37]" />
                        <h3 className="font-semibold text-[#0c100c]">Deliver To {user?.firstName || ''}</h3>
                      </div>
                      <p className="text-sm whitespace-pre-wrap text-[#2b1e1e]">
                        {addresses.find(a => a._id === selectedShippingAddressId)?.address || 'Select a shipping address'}
                      </p>
                      {user?.email && <p className="text-sm text-[#2b1e1e] mt-1">{user.email}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button type="button" className="px-3 py-1 rounded-lg border border-[#e8e0d5] text-sm hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
                        Change
                      </button>
                      <span className="px-2 py-1 rounded-md bg-[#0c100c] text-[#fefcf8] text-xs">Tap To Edit Address</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">Shipping Address</label>
                    {addresses.length === 0 ? (
                      <div className="p-3 rounded-lg border border-[#e8e0d5] bg-[#f5f1e8]">
                        <p className="text-sm text-[#2b1e1e]">No addresses found. Please add a shipping address in your profile.</p>
                      </div>
                    ) : (
                      <select
                        value={selectedShippingAddressId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedShippingAddressId(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none bg-white text-[#0c100c]"
                      >
                        {addresses.map((a) => (
                          <option key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.city}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="p-3 mt-3 rounded-lg border border-[#e8e0d5]">
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                      <span className="text-sm font-semibold text-[#0c100c]">Free Shipping</span>
                      <span className="text-sm text-[#2b1e1e]">Get it by 10 Nov, 9 AM</span>
                      <span className="px-2 py-1 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs font-medium">Free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers & Rewards */}
              <div className="px-6 pb-6">
                <h3 className="text-base font-semibold text-[#0c100c] mb-2">OFFERS & REWARDS</h3>
                <div className="rounded-lg border border-[#e8e0d5] overflow-hidden">
                  <div className="bg-[#d4af37]/10 text-[#d4af37] font-bold px-4 py-2">
                    You saved ${(totalSavings / 100).toFixed(2)}
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2b1e1e]" />
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none bg-white text-[#0c100c]"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-1 hover:bg-[#f5f1e8] rounded-lg transition-colors">
                          <FiTag className="w-4 h-4 text-[#2b1e1e]" />
                        </button>
                        <span className="text-sm text-[#2b1e1e]">8 coupons available</span>
                      </div>
                      <button type="button" className="text-sm text-[#2b1e1e] hover:text-[#d4af37] font-medium transition-colors">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#e8e0d5] flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setCheckoutDialogOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedShippingAddressId || orderLoading || addresses.length === 0}
                className="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
                title={addresses.length === 0 ? 'Please add a shipping address first' : !selectedShippingAddressId ? 'Please select a shipping address' : ''}
              >
                {orderLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
