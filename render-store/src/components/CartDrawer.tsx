import DeleteIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useAmountOffOrder } from '../contexts/amount-off-order.context';
import { useFreeShipping } from '../contexts/storefront-free-shipping.context';
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
  const { fetchEligibleDiscounts, amountOffOrderDiscountCodeCheck } = useAmountOffOrder();
  const { checkEligibleFreeShippingDiscounts, validateFreeShippingDiscountCode, clearDiscountCodeResult: clearFreeShippingCodeResult } = useFreeShipping();
  const { addresses } = useCustomerAddresses();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();

  const [selectedDiscount, setSelectedDiscount] = React.useState<any>(null);
  const [discountCode, setDiscountCode] = React.useState<string>('');
  const [discountCodeResult, setDiscountCodeResult] = React.useState<any>(null);
  const [discountCodeErrorState, setDiscountCodeError] = React.useState<string | null>(null);
  const [discountCodeLoadingState, setDiscountCodeLoading] = React.useState<boolean>(false);
  const [freeShippingCode, setFreeShippingCode] = React.useState<string>('');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'cod' | 'other'>('cod');

  const debounceTimerRef = useRef<any>(null);
  const freeShippingDebounceTimerRef = useRef<any>(null);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (user?._id) getCartByCustomerId(user._id).catch(() => {}); }, [user?._id]);
  useEffect(() => {
    if (user?._id && storeFrontMeta?.storeId && items.length > 0) {
      const cartItems = items.map(item => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        return { productId: pv?._id || '', quantity: item.quantity, price: pv?.price || 0 };
      });
      fetchEligibleDiscounts(storeFrontMeta.storeId, user._id, cartItems);
      const defaultAddress = user?.defaultAddress ? addresses.find(addr => addr._id === user.defaultAddress) : null;
      checkEligibleFreeShippingDiscounts({
        storeId: storeFrontMeta.storeId,
        customerId: user._id,
        cartItems,
        shippingAddress: defaultAddress ? { country: defaultAddress.country, state: defaultAddress.state, city: defaultAddress.city } : undefined,
        currentShippingRate: 10
      });
    }
  }, [user?._id, storeFrontMeta?.storeId, items, fetchEligibleDiscounts]);

  const validateDiscountCode = useCallback(async (code: string) => {
    if (!code.trim() || !user?._id || !storeFrontMeta?.storeId || items.length === 0) { setDiscountCodeResult(null); setDiscountCodeError(null); return; }
    setDiscountCodeLoading(true); setDiscountCodeError(null);
    try {
      const cartItems = items.map(item => { const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null; return { productId: pv?._id || '', quantity: item.quantity, price: pv?.price || 0 }; });
      const result = await amountOffOrderDiscountCodeCheck(storeFrontMeta.storeId, user._id, cartItems, code.trim());
      if (result) { setDiscountCodeResult(result); setDiscountCodeError(null); } else { setDiscountCodeResult(null); setDiscountCodeError('Invalid discount code'); }
    } catch { setDiscountCodeResult(null); setDiscountCodeError('Failed to validate discount code'); }
    finally { setDiscountCodeLoading(false); }
  }, [user?._id, storeFrontMeta?.storeId, items, amountOffOrderDiscountCodeCheck]);

  const validateFreeShippingCode = useCallback(async (code: string) => {
    if (!code.trim() || !user?._id || !storeFrontMeta?.storeId || items.length === 0) { clearFreeShippingCodeResult(); return; }
    try {
      const cartItems = items.map(item => { const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null; return { productId: pv?._id || '', quantity: item.quantity, price: pv?.price || 0 }; });
      const defaultAddress = user?.defaultAddress ? addresses.find(addr => addr._id === user.defaultAddress) : null;
      await validateFreeShippingDiscountCode({ storeId: storeFrontMeta.storeId, customerId: user._id, cartItems, discountCode: code.trim(), shippingAddress: defaultAddress ? { country: defaultAddress.country, state: defaultAddress.state, city: defaultAddress.city } : undefined, currentShippingRate: 10 });
    } catch (e) { console.error(e); }
  }, [user?._id, storeFrontMeta?.storeId, items, validateFreeShippingDiscountCode, clearFreeShippingCodeResult]);

  useEffect(() => () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (freeShippingDebounceTimerRef.current) clearTimeout(freeShippingDebounceTimerRef.current);
  }, []);

  const subtotal = React.useMemo(() => items.reduce((sum, it) => { const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null; return sum + ((pv?.price ?? 0) * it.quantity); }, 0), [items]);
  const discountAmount = React.useMemo(() => { if (discountCodeResult) return discountCodeResult.discountAmount || 0; if (selectedDiscount) return selectedDiscount.discountAmount || 0; return 0; }, [discountCodeResult, selectedDiscount]);
  const finalTotal = React.useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const shippingCost = 0; const tax = 0;

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
      await createOrder({ storeId: storeFrontMeta.storeId, shippingAddressId: selectedShippingAddressId, billingAddressId: selectedBillingAddressId || undefined, items: orderItems, paymentMethod, subtotal, tax, shippingCost, total: finalTotal + shippingCost + tax });
      setCheckoutDialogOpen(false);
      await Promise.all(items.map(item => deleteCartEntry(item._id).catch(() => {})));
      clear();
    } catch (error) { console.error('Failed to create order:', error); }
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, bgcolor: '#fff' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" fontWeight={800}>Your Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ p: 2, pb: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Your cart is empty</Typography>
              <Button variant="contained" onClick={onClose}>Continue Shopping</Button>
            </Box>
          ) : (
            <>
              <Stack flex={1} spacing={2} sx={{ overflowY: 'auto', pr: 0.5 }}>
                {items.map((it) => {
                  const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
                  const image = pv?.images?.[0];
                  const title = pv?.sku || 'Product';
                  const price = pv?.price ?? 0;
                  return (
                    <Card key={it._id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box component="img" src={image || 'https://via.placeholder.com/96'} alt={title} sx={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 1, bgcolor: '#eee', flexShrink: 0 }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={700} noWrap title={title} sx={{ color: '#111' }}>{title}</Typography>
                            {pv?.optionValues && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{Object.entries(pv.optionValues).map(([k,v]) => `${k}: ${v}`).join(', ')}</Typography>}
                          </Box>
                          <Stack spacing={1} alignItems="flex-end" sx={{ minWidth: 140 }}>
                            <Typography variant="body1" fontWeight={700} sx={{ color: '#111' }}>${(price/100 * it.quantity).toFixed(2)}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Button size="small" variant="outlined" onClick={() => updateCartEntry({ id: it._id, quantity: Math.max(1, it.quantity - 1) })}>-</Button>
                              <Typography variant="body2" sx={{ width: 24, textAlign: 'center' }}>{it.quantity}</Typography>
                              <Button size="small" variant="outlined" onClick={() => updateCartEntry({ id: it._id, quantity: it.quantity + 1 })}>+</Button>
                            </Stack>
                            <IconButton color="error" onClick={() => deleteCartEntry(it._id)} size="small"><DeleteIcon /></IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1} sx={{ mb: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#111' }}>${(subtotal/100).toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={800} sx={{ color: '#111' }}>Total</Typography>
                    <Typography variant="body1" fontWeight={800} sx={{ color: '#111' }}>${(finalTotal/100).toFixed(2)}</Typography>
                  </Stack>
                </Stack>
                <Button fullWidth variant="contained" color="primary" onClick={handleCheckoutClick} disabled={items.length === 0}>Pay Now</Button>
              </Box>
            </>
          )}
        </Box>
        <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle><Typography variant="h6" fontWeight={700}>Checkout</Typography></DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel id="shipping-address-label">Shipping Address</InputLabel>
                <Select labelId="shipping-address-label" label="Shipping Address" value={selectedShippingAddressId} onChange={(e) => setSelectedShippingAddressId(e.target.value)}>
                  {addresses.map((address) => (
                    <MenuItem key={address._id} value={address._id}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{address.firstName} {address.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{address.address}, {address.city}, {address.state} {address.pinCode}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="billing-address-label">Billing Address (Optional)</InputLabel>
                <Select labelId="billing-address-label" label="Billing Address (Optional)" value={selectedBillingAddressId} onChange={(e) => setSelectedBillingAddressId(e.target.value)}>
                  <MenuItem value=""><em>Same as shipping address</em></MenuItem>
                  {addresses.map((address) => (
                    <MenuItem key={address._id} value={address._id}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{address.firstName} {address.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{address.address}, {address.city}, {address.state} {address.pinCode}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select labelId="payment-method-label" label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
                  <MenuItem value="cod">Cash on Delivery</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Divider />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Order Summary</Typography>
                <Stack spacing={0.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Subtotal</Typography><Typography variant="body2">${(subtotal/100).toFixed(2)}</Typography></Box>
                  {discountAmount > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Discount</Typography><Typography variant="body2" color="success.main">-${(discountAmount/100).toFixed(2)}</Typography></Box>}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Shipping</Typography><Typography variant="body2">${(shippingCost/100).toFixed(2)}</Typography></Box>
                  {tax > 0 && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="text.secondary">Tax</Typography><Typography variant="body2">${(tax/100).toFixed(2)}</Typography></Box>}
                  <Divider sx={{ my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body1" fontWeight={700}>Total</Typography><Typography variant="body1" fontWeight={700}>${((finalTotal + shippingCost + tax)/100).toFixed(2)}</Typography></Box>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckoutDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handlePlaceOrder} disabled={!selectedShippingAddressId || orderLoading} sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5568d3' } }}>{orderLoading ? 'Placing Order...' : 'Place Order'}</Button>
          </DialogActions>
        </Dialog>
      </Drawer>
    </>
  );
};

export default CartDrawer;
