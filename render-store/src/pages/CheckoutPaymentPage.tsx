import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PaymentGateway, { type PaymentManualSubmitDetails } from '../components/PaymentGateway';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { usePayment } from '../contexts/payment.context';
import {
  clearPendingCheckout,
  loadPendingCheckout,
  type PendingCheckoutState,
} from '../utils/pendingCheckout';

/**
 * Full-page UPI payment step. Expects `location.state` from checkout navigation,
 * or falls back to sessionStorage (same tab).
 */
const CheckoutPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStorefrontAuth();
  const { createOrder, loading } = useStorefrontOrder();
  const { deleteCartEntry, clear } = useStorefrontCart();
  const { confirmPayment } = usePayment();

  const [pending, setPending] = useState<PendingCheckoutState | null | undefined>(undefined);

  useEffect(() => {
    const fromState = (location.state as { pending?: PendingCheckoutState } | null)?.pending;
    if (fromState) {
      setPending(fromState);
      return;
    }
    setPending(loadPendingCheckout());
  }, [location.state]);

  const canShow = useMemo(() => !!pending && pending.amountPaise > 0, [pending]);

  const handlePaymentSuccess = async (details: PaymentManualSubmitDetails) => {
    if (!pending) throw new Error('Missing checkout data');
    if (!user?._id) throw new Error('Please sign in to complete payment.');
    const { storeId } = pending.createOrderPayload;
    await confirmPayment({
      storeId,
      customerId: user._id,
      name: details.name,
      email: details.email,
      utr: details.utr,
      referenceId: details.referenceId,
      amountPaise: pending.amountPaise,
      merchantName: pending.merchantName,
      orderId: pending.orderIdDisplay ?? null,
    });
    const payload = {
      ...pending.createOrderPayload,
      paymentMethod: 'other' as const,
    };
    await createOrder(payload);
    clearPendingCheckout();
    for (const id of pending.cartEntryIds) {
      await deleteCartEntry(id).catch(() => {});
    }
    if (pending.cartEntryIds.length > 0) {
      clear();
    }
    navigate('/order-success', { replace: true });
  };

  if (pending === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--ivory-white,#fefcf8)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--warm-beige)] border-t-[var(--charcoal-black)]" />
      </div>
    );
  }

  if (pending === null || !canShow) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f0f4f8]">
      <header className="flex shrink-0 justify-center px-4 pb-3 pt-[max(2rem,calc(env(safe-area-inset-top)+1rem))] sm:pt-[max(2.5rem,calc(env(safe-area-inset-top)+1.25rem))]">
        <div className="flex w-full max-w-[420px] justify-start">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg px-1 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900"
            disabled={loading}
          >
            ← Back to checkout
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="payment-gateway-shell w-full max-w-[420px] py-2">
          <PaymentGateway
            merchantName={pending.merchantName}
            amountPaise={pending.amountPaise}
            orderId={pending.orderIdDisplay}
            itemSummaryLine={pending.itemSummaryLine}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentPage;
