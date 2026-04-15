import { useMemo } from 'react';
import type { BuyXGetYDiscount, BuyXGetYGetsItem } from '../contexts/buy-x-get-y.context';
import { formatINR } from '../utils/currency';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/96';

export type BxgyBuyContext = {
  quantity: number;
  productTitle: string;
};

type Props = {
  /** BXGY currently applied in checkout context (used for order + discount id). */
  appliedBxgy: BuyXGetYDiscount | null | undefined;
  /**
   * Best eligible BXGY from the last /check response (may still have getsItems when
   * applied is null because another discount e.g. free shipping won the combo).
   */
  eligibleBxgy: BuyXGetYDiscount | null | undefined;
  selectedGetsItems: BuyXGetYGetsItem[] | null | undefined;
  buyContext?: BxgyBuyContext | null;
  onChooseItemsClick?: () => void;
};

function sameDiscount(a: BuyXGetYDiscount | null | undefined, b: BuyXGetYDiscount | null | undefined) {
  if (!a || !b) return false;
  return String(a.id) === String(b.id);
}

function priceLine(gi: BuyXGetYGetsItem) {
  const orig = gi.originalPrice * gi.quantity;
  const paid = gi.discountedPrice * gi.quantity;
  if (gi.discountType === 'free') {
    return (
      <p className="text-xs text-gray-600 mt-0.5">
        <span className="line-through text-gray-400">{formatINR(orig)}</span>
        <span className="ml-1.5 font-semibold text-emerald-700">Free</span>
        <span className="ml-1 text-[10px] uppercase tracking-wide text-emerald-600/90">({gi.discountTypeLabel})</span>
      </p>
    );
  }
  return (
    <p className="text-xs text-gray-600 mt-0.5">
      <span className="line-through text-gray-400">{formatINR(orig)}</span>
      <span className="ml-1.5 font-semibold text-gray-900">{formatINR(paid)}</span>
      <span className="ml-1 text-[10px] text-emerald-700">({gi.discountTypeLabel})</span>
    </p>
  );
}

/**
 * Lists populated “get” lines from the BXGY check API (or user-picked collection items).
 * Shows eligible rewards even when another discount “wins” the automatic bundle (e.g. free shipping).
 */
export function BxgyCheckoutGetsSection({
  appliedBxgy,
  eligibleBxgy,
  selectedGetsItems,
  buyContext,
  onChooseItemsClick,
}: Props) {
  const mergedApplied = useMemo((): BuyXGetYDiscount | null => {
    if (!appliedBxgy) return null;
    if (appliedBxgy.getsItems?.length) return appliedBxgy;
    if (eligibleBxgy && sameDiscount(appliedBxgy, eligibleBxgy) && eligibleBxgy.getsItems?.length) {
      return { ...appliedBxgy, getsItems: eligibleBxgy.getsItems };
    }
    return appliedBxgy;
  }, [appliedBxgy, eligibleBxgy]);

  const effective = mergedApplied ?? eligibleBxgy ?? null;
  if (!effective) return null;

  const isAppliedMode = !!appliedBxgy;

  const isCollectionGets = effective.customerGetsAnyItemsFrom === 'specific-collections';
  const hasCollectionPicker =
    isCollectionGets && (effective.getsCollectionIds?.length ?? 0) > 0 && !!onChooseItemsClick;
  const awaitingCollectionChoice =
    hasCollectionPicker && (!selectedGetsItems || selectedGetsItems.length === 0);

  if (awaitingCollectionChoice) {
    return (
      <div className="px-6 pb-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="text-sm font-semibold text-amber-950 mb-1">Buy X Get Y — choose your items</h3>
          {buyContext && (
            <p className="text-xs text-amber-900/90 mb-2">
              You&apos;re buying <span className="font-semibold">{buyContext.quantity}×</span>{' '}
              {buyContext.productTitle}. That qualifies you for this offer.{' '}
              {effective.message || 'Pick the product(s) you want at the promotional price.'}
            </p>
          )}
          {!buyContext && (
            <p className="text-xs text-amber-900/90 mb-2">
              {effective.message || 'Your cart qualifies. Pick the product(s) you want at the promotional price.'}
            </p>
          )}
          {effective.discountSummary ? (
            <p className="text-[11px] text-amber-900/80 mb-3">{effective.discountSummary}</p>
          ) : null}
          <button
            type="button"
            onClick={onChooseItemsClick}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            Choose items
          </button>
        </div>
      </div>
    );
  }

  const items: BuyXGetYGetsItem[] =
    isCollectionGets && selectedGetsItems && selectedGetsItems.length > 0
      ? selectedGetsItems
      : effective.getsItems ?? [];

  if (items.length > 0) {
    return (
      <div className="px-6 pb-4">
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            isAppliedMode
              ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white'
              : 'border-slate-200 bg-gradient-to-b from-slate-50/90 to-white'
          }`}
        >
          <h3
            className={`text-sm font-semibold mb-1 ${isAppliedMode ? 'text-emerald-950' : 'text-slate-900'}`}
          >
            {isAppliedMode ? 'Buy X Get Y — included with this order' : 'Buy X Get Y — you qualify for this reward'}
          </h3>
          {!isAppliedMode && (
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              Another discount (such as free shipping) is giving a larger saving on this checkout, so this offer is
              not applied to your order total. Below is what you would receive when this Buy X Get Y is the active
              discount.
            </p>
          )}
          {buyContext && (
            <p className={`text-xs mb-2 ${isAppliedMode ? 'text-emerald-900/85' : 'text-slate-800'}`}>
              You&apos;re buying <span className="font-semibold">{buyContext.quantity}×</span>{' '}
              {buyContext.productTitle}. That meets the buy side of this offer{isAppliedMode ? ', so you also get:' : ':'}
            </p>
          )}
          {!buyContext && (
            <p className={`text-xs mb-2 ${isAppliedMode ? 'text-emerald-900/85' : 'text-slate-700'}`}>
              {isAppliedMode
                ? 'Your qualifying items unlock the “get” part of this offer. You also receive:'
                : 'Your qualifying items unlock the “get” part of this offer:'}
            </p>
          )}
          {effective.discountSummary ? (
            <p
              className={`text-[11px] mb-3 ${isAppliedMode ? 'text-emerald-800/80' : 'text-slate-600'}`}
            >
              {effective.discountSummary}
            </p>
          ) : null}
          <ul className="space-y-3" aria-label="Buy X Get Y reward items">
            {items.map((gi) => (
              <li
                key={`${gi.productVariantId}-${gi.productId}-${gi.quantity}`}
                className={`flex gap-3 items-stretch rounded-lg border p-2.5 ${
                  isAppliedMode ? 'border-emerald-100 bg-white' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-md border border-gray-100 bg-gray-50 overflow-hidden">
                  <img
                    src={gi.productImage || PLACEHOLDER_IMG}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{gi.productTitle}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Qty {gi.quantity}</p>
                  {priceLine(gi)}
                </div>
                <div className="flex flex-col items-end justify-center text-right flex-shrink-0">
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wide ${isAppliedMode ? 'text-emerald-700' : 'text-slate-600'}`}
                  >
                    You save
                  </span>
                  <span className={`text-sm font-bold ${isAppliedMode ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {formatINR(gi.savings)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
