import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiX, FiArrowLeft, FiLock, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import { useFreeShipping } from '../contexts/storefront-free-shipping.context';
import { useAmountOffOrder } from '../contexts/amount-off-order.context';
import { useAmountOffProduct } from '../contexts/amount-off-product.context';
import { useBuyXGetY } from '../contexts/buy-x-get-y.context';
import type { BuyXGetYCartItem } from '../contexts/buy-x-get-y.context';
import { BxgyChooseItemsModal } from './BxgyChooseItemsModal';
import { BxgyCheckoutGetsSection } from './BxgyCheckoutGetsSection';
import { formatINR } from '../utils/currency';
import { useStorefrontCountries } from '../contexts/storefront-country.context';
import ZiplofyLogo from '../assets/ziplofy-logo.png';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { user, checkAuth } = useStorefrontAuth();
  const { items, guestItems, isGuest, getCartByCustomerId, updateCartEntry, deleteCartEntry, clear } = useStorefrontCart();

  // Use guest items when not logged in, otherwise use server items
  const displayItems = isGuest ? guestItems : items;
  const { addresses, fetchCustomerAddressesByCustomerId, addCustomerAddress, loading: addressLoading } = useCustomerAddresses();
  const { countries, getCountries, loading: countriesLoading } = useStorefrontCountries();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();
  const {
    eligibleDiscounts,
    discountCodeResult,
    appliedAutomaticDiscount,
    loading: freeShippingLoading,
    checkEligibleFreeShippingDiscounts,
    applyAutomaticDiscount,
    clearAppliedAutomaticDiscount,
  } = useFreeShipping();
  const {
    eligibleDiscounts: aooEligibleDiscounts,
    loading: aooLoading,
    discountCodeResult: aooDiscountCodeResult,
    appliedAutomaticDiscount: aooAppliedAutomaticDiscount,
    // discountCodeLoading: aooDiscountCodeLoading,
    // discountCodeError: aooDiscountCodeError,
    fetchEligibleDiscounts: fetchAooEligibleDiscounts,
    // amountOffOrderDiscountCodeCheck: applyAooDiscountCode,
    applyAutomaticDiscount: applyAooAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearAooAppliedAutomaticDiscount,
    // clearDiscountCodeResult: clearAooDiscountCodeResult,
  } = useAmountOffOrder();
  const {
    eligibleDiscounts: aopEligibleDiscounts,
    loading: aopLoading,
    discountCodeResult: aopDiscountCodeResult,
    appliedAutomaticDiscount: aopAppliedAutomaticDiscount,
    // discountCodeLoading: aopDiscountCodeLoading,
    // discountCodeError: aopDiscountCodeError,
    fetchEligibleDiscounts: fetchAopEligibleDiscounts,
    // amountOffProductDiscountCodeCheck: applyAopDiscountCode,
    applyAutomaticDiscount: applyAopAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearAopAppliedAutomaticDiscount,
    // clearDiscountCodeResult: clearAopDiscountCodeResult,
  } = useAmountOffProduct();
  const {
    eligibleDiscounts: bxgyEligibleDiscounts,
    loading: bxgyLoading,
    discountCodeResult: bxgyDiscountCodeResult,
    appliedAutomaticDiscount: bxgyAppliedAutomaticDiscount,
    selectedGetsItems: bxgySelectedGetsItems,
    setSelectedGetsItems: setBxgySelectedGetsItems,
    // discountCodeLoading: bxgyDiscountCodeLoading,
    // discountCodeError: bxgyDiscountCodeError,
    fetchEligibleDiscounts: fetchBxgyEligibleDiscounts,
    // validateDiscountCode: validateBxgyDiscountCode,
    applyAutomaticDiscount: applyBxgyAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearBxgyAppliedAutomaticDiscount,
    // clearDiscountCodeResult: clearBxgyDiscountCodeResult,
  } = useBuyXGetY();

  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  const [selectedBillingAddressId] = useState<string>('');
  const [bxgyChooseItemsModalOpen, setBxgyChooseItemsModalOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Refs for scrolling to applied offers
  const appliedOffersRef = useRef<HTMLDivElement>(null);
  const checkoutScrollContainerRef = useRef<HTMLDivElement>(null);

  // Discount breakdown expand state
  const [discountBreakdownExpanded, setDiscountBreakdownExpanded] = useState(false);

  // Add Address Modal State
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressType: 'home',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    countryId: '',
    pinCode: '',
    phoneNumber: '',
  });

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!open) return;
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
      fetchCustomerAddressesByCustomerId(user._id).catch(() => {});
    }
  }, [open, user?._id, getCartByCustomerId, fetchCustomerAddressesByCustomerId]);

  // Fetch countries when add address modal opens
  useEffect(() => {
    if (addAddressModalOpen && countries.length === 0) {
      getCountries({ limit: 300 }).catch(() => {});
    }
  }, [addAddressModalOpen, countries.length, getCountries]);

  // Set default country (India) when countries are loaded
  useEffect(() => {
    if (countries.length > 0 && !newAddress.countryId) {
      const india = countries.find((c) => c.iso2 === 'IN');
      if (india) {
        setNewAddress((prev) => ({ ...prev, countryId: india._id }));
      } else {
        setNewAddress((prev) => ({ ...prev, countryId: countries[0]._id }));
      }
    }
  }, [countries, newAddress.countryId]);

  // Check eligible free shipping when checkout modal opens and cart/address changes
  const cartItemsForApi = useMemo(() => {
    return displayItems.map((it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      const price = pv?.price ?? 0;
      return {
        productId: typeof it.productVariantId === 'object' ? (it.productVariantId as any)._id : String(it.productVariantId),
        quantity: it.quantity,
        price,
      };
    });
  }, [displayItems]);

  // Cart items for Buy X Get Y API (productId = product _id when available; collectionIds optional)
  const buyXGetYCartItems = useMemo((): BuyXGetYCartItem[] => {
    return displayItems.map((it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      const price = pv?.price ?? 0;
      const productId = pv?.productId ?? (typeof it.productVariantId === 'object' ? (it.productVariantId as any)._id : String(it.productVariantId));
      return {
        productId,
        collectionIds: (pv as any)?.collectionIds ?? undefined,
        quantity: it.quantity,
        price,
      };
    });
  }, [displayItems]);

  // Stable string key to avoid effect re-runs when array refs change but content is same
  const cartItemsKey = useMemo(() => JSON.stringify(cartItemsForApi.map((c) => `${c.productId}:${c.quantity}:${c.price}`)), [cartItemsForApi]);
  const bxgyCartItemsKey = useMemo(() => JSON.stringify(buyXGetYCartItems.map((c) => `${c.productId}:${c.quantity}:${c.price}`)), [buyXGetYCartItems]);
  const selectedAddrData = addresses.find((a) => a._id === selectedShippingAddressId);
  /** When cart opens before checkout, fall back to first saved address so free-shipping eligibility can run. */
  const addressForFreeShippingCheck = selectedAddrData ?? (addresses.length > 0 ? addresses[0] : undefined);
  const shippingCountryIso2 = (addressForFreeShippingCheck?.countryId as { iso2?: string })?.iso2;

  const discountsContextActive = open || checkoutDialogOpen;
  const discountsOffersLoading =
    discountsContextActive &&
    (aooLoading || aopLoading || bxgyLoading || (!!user?._id && freeShippingLoading));

  useEffect(() => {
    if (!discountsContextActive || !storeFrontMeta?.storeId || !user?._id || cartItemsForApi.length === 0) return;
    const addr = addressForFreeShippingCheck;
    checkEligibleFreeShippingDiscounts({
      storeId: storeFrontMeta.storeId,
      customerId: user._id,
      cartItems: cartItemsForApi,
      shippingAddress: addr
        ? {
            country: (addr.countryId as { iso2?: string })?.iso2,
            countryId: typeof addr.countryId === 'object' ? (addr.countryId as any)?._id : addr.countryId,
            state: addr.state,
            city: addr.city,
          }
        : undefined,
    }).catch(() => {});
  }, [
    discountsContextActive,
    storeFrontMeta?.storeId,
    user?._id,
    cartItemsKey,
    shippingCountryIso2,
    addressForFreeShippingCheck?._id,
    checkEligibleFreeShippingDiscounts,
  ]);

  // Check eligible amount-off-order discounts when cart or checkout is open and cart changes
  useEffect(() => {
    if (!discountsContextActive || !storeFrontMeta?.storeId || cartItemsForApi.length === 0) return;
    fetchAooEligibleDiscounts(
      storeFrontMeta.storeId,
      user?._id ?? null,
      cartItemsForApi
    ).catch(() => {});
  }, [discountsContextActive, storeFrontMeta?.storeId, user?._id, cartItemsKey, fetchAooEligibleDiscounts]);

  // Check eligible amount-off-product discounts when cart or checkout is open and cart changes
  useEffect(() => {
    if (!discountsContextActive || !storeFrontMeta?.storeId || buyXGetYCartItems.length === 0) return;
    fetchAopEligibleDiscounts(
      storeFrontMeta.storeId,
      user?._id ?? null,
      buyXGetYCartItems
    ).catch(() => {});
  }, [discountsContextActive, storeFrontMeta?.storeId, user?._id, bxgyCartItemsKey, fetchAopEligibleDiscounts]);

  // Check eligible Buy X Get Y discounts when cart or checkout is open and cart changes
  useEffect(() => {
    if (!discountsContextActive || !storeFrontMeta?.storeId || buyXGetYCartItems.length === 0) return;
    fetchBxgyEligibleDiscounts(
      storeFrontMeta.storeId,
      user?._id ?? null,
      buyXGetYCartItems
    ).catch(() => {});
  }, [discountsContextActive, storeFrontMeta?.storeId, user?._id, bxgyCartItemsKey, fetchBxgyEligibleDiscounts]);

  // Amounts are stored in paisa (minor units), so 200 rupees = 20000
  const shippingCost = 20000; // Hardcoded ₹200 for now

  // ─────────────────────────────────────────────────────────────────────────────
  // COMBINATION VALIDATION LOGIC
  // Check which discounts can stack based on their combinations data and apply
  // only compatible discounts that maximize customer savings.
  // ─────────────────────────────────────────────────────────────────────────────

  // Helper: Check if two discounts are compatible based on their combinations
  const areDiscountsCompatible = (
    d1: { type: 'shipping' | 'order' | 'product' | 'bxgy'; combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean } },
    d2: { type: 'shipping' | 'order' | 'product' | 'bxgy'; combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean } }
  ): boolean => {
    // Map discount types to the combination field they need to check
    const getRequiredField = (targetType: string): 'productDiscounts' | 'orderDiscounts' | 'shippingDiscounts' => {
      if (targetType === 'shipping') return 'shippingDiscounts';
      if (targetType === 'order') return 'orderDiscounts';
      return 'productDiscounts'; // product and bxgy are both product discounts
    };

    // For two discounts to be compatible:
    // 1. d1 must allow d2's type
    // 2. d2 must allow d1's type
    const d1AllowsD2 = (() => {
      const field = getRequiredField(d2.type);
      if (field === 'shippingDiscounts') {
        // Free shipping doesn't have shippingDiscounts field
        return d1.type === 'shipping' || d1.combinations.shippingDiscounts !== false;
      }
      return d1.combinations[field] !== false;
    })();

    const d2AllowsD1 = (() => {
      const field = getRequiredField(d1.type);
      if (field === 'shippingDiscounts') {
        return d2.type === 'shipping' || d2.combinations.shippingDiscounts !== false;
      }
      return d2.combinations[field] !== false;
    })();

    return d1AllowsD2 && d2AllowsD1;
  };

  // Helper: Check if a set of discounts are all mutually compatible
  const isValidCombination = (
    discounts: Array<{ type: 'shipping' | 'order' | 'product' | 'bxgy'; combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean }; amount: number }>
  ): boolean => {
    for (let i = 0; i < discounts.length; i++) {
      for (let j = i + 1; j < discounts.length; j++) {
        if (!areDiscountsCompatible(discounts[i], discounts[j])) {
          return false;
        }
      }
    }
    return true;
  };

  // Unified auto-apply effect using combination validation
  useEffect(() => {
    if (!discountsContextActive) return;

    // Get best eligible discount from each type (skip if manual code applied)
    const candidates: Array<{
      type: 'shipping' | 'order' | 'product' | 'bxgy';
      discount: any;
      amount: number;
      combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean };
      apply: () => void;
      clear: () => void;
      currentlyApplied: any;
    }> = [];

    // Free Shipping
    if (!discountCodeResult && eligibleDiscounts.length > 0) {
      const best = eligibleDiscounts[0];
      candidates.push({
        type: 'shipping',
        discount: best,
        amount: shippingCost, // Free shipping saves the shipping cost
        combinations: best.combinations || { productDiscounts: true, orderDiscounts: true },
        apply: () => applyAutomaticDiscount(best),
        clear: clearAppliedAutomaticDiscount,
        currentlyApplied: appliedAutomaticDiscount,
      });
    }

    // Amount Off Order
    if (!aooDiscountCodeResult && aooEligibleDiscounts.length > 0) {
      const best = aooEligibleDiscounts[0];
      candidates.push({
        type: 'order',
        discount: best,
        amount: best.discountAmount || 0,
        combinations: best.combinations || { productDiscounts: true, orderDiscounts: true, shippingDiscounts: true },
        apply: () => applyAooAutomaticDiscount(best),
        clear: clearAooAppliedAutomaticDiscount,
        currentlyApplied: aooAppliedAutomaticDiscount,
      });
    }

    // Amount Off Product
    if (!aopDiscountCodeResult && aopEligibleDiscounts.length > 0) {
      const best = aopEligibleDiscounts[0];
      candidates.push({
        type: 'product',
        discount: best,
        amount: best.discountAmount || 0,
        combinations: best.combinations || { productDiscounts: true, orderDiscounts: true, shippingDiscounts: true },
        apply: () => applyAopAutomaticDiscount(best),
        clear: clearAopAppliedAutomaticDiscount,
        currentlyApplied: aopAppliedAutomaticDiscount,
      });
    }

    // Buy X Get Y
    if (!bxgyDiscountCodeResult && bxgyEligibleDiscounts.length > 0) {
      const best = bxgyEligibleDiscounts[0];
      candidates.push({
        type: 'bxgy',
        discount: best,
        amount: best.totalDiscountAmount || 0,
        combinations: best.combinations || { productDiscounts: true, orderDiscounts: true, shippingDiscounts: true },
        apply: () => applyBxgyAutomaticDiscount(best),
        clear: clearBxgyAppliedAutomaticDiscount,
        currentlyApplied: bxgyAppliedAutomaticDiscount,
      });
    }

    // If no candidates, clear all automatic discounts
    if (candidates.length === 0) {
      if (appliedAutomaticDiscount) clearAppliedAutomaticDiscount();
      if (aooAppliedAutomaticDiscount) clearAooAppliedAutomaticDiscount();
      if (aopAppliedAutomaticDiscount) clearAopAppliedAutomaticDiscount();
      if (bxgyAppliedAutomaticDiscount) clearBxgyAppliedAutomaticDiscount();
      return;
    }

    // Generate all possible subsets and find the one with maximum savings
    // that has all mutually compatible discounts
    let bestCombination: typeof candidates = [];
    let bestSavings = 0;

    const n = candidates.length;
    for (let mask = 1; mask < (1 << n); mask++) {
      const subset: typeof candidates = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          subset.push(candidates[i]);
        }
      }

      // Check if this subset is valid (all discounts compatible with each other)
      const discountsForValidation = subset.map((c) => ({
        type: c.type,
        combinations: c.combinations,
        amount: c.amount,
      }));

      if (isValidCombination(discountsForValidation)) {
        const totalSavings = subset.reduce((sum, c) => sum + c.amount, 0);
        if (totalSavings > bestSavings) {
          bestSavings = totalSavings;
          bestCombination = subset;
        }
      }
    }

    // Determine which discounts should be applied and which should be cleared
    const typesToApply = new Set(bestCombination.map((c) => c.type));

    // Clear discounts not in best combination
    if (!typesToApply.has('shipping') && appliedAutomaticDiscount && !discountCodeResult) {
      clearAppliedAutomaticDiscount();
    }
    if (!typesToApply.has('order') && aooAppliedAutomaticDiscount && !aooDiscountCodeResult) {
      clearAooAppliedAutomaticDiscount();
    }
    if (!typesToApply.has('product') && aopAppliedAutomaticDiscount && !aopDiscountCodeResult) {
      clearAopAppliedAutomaticDiscount();
    }
    if (!typesToApply.has('bxgy') && bxgyAppliedAutomaticDiscount && !bxgyDiscountCodeResult) {
      clearBxgyAppliedAutomaticDiscount();
    }

    // Apply discounts in best combination
    for (const candidate of bestCombination) {
      const isAlreadyApplied = candidate.currentlyApplied?.id === candidate.discount.id;
      if (!isAlreadyApplied) {
        candidate.apply();
      }
    }
  }, [
    discountsContextActive,
    shippingCost,
    // Free Shipping
    eligibleDiscounts,
    discountCodeResult,
    appliedAutomaticDiscount,
    applyAutomaticDiscount,
    clearAppliedAutomaticDiscount,
    // Amount Off Order
    aooEligibleDiscounts,
    aooDiscountCodeResult,
    aooAppliedAutomaticDiscount,
    applyAooAutomaticDiscount,
    clearAooAppliedAutomaticDiscount,
    // Amount Off Product
    aopEligibleDiscounts,
    aopDiscountCodeResult,
    aopAppliedAutomaticDiscount,
    applyAopAutomaticDiscount,
    clearAopAppliedAutomaticDiscount,
    // Buy X Get Y
    bxgyEligibleDiscounts,
    bxgyDiscountCodeResult,
    bxgyAppliedAutomaticDiscount,
    applyBxgyAutomaticDiscount,
    clearBxgyAppliedAutomaticDiscount,
  ]);

  // For BXGY discounts where the "gets" come from specific collections, automatically
  // prompt the customer to choose items once a discount is applied and no items
  // have been selected yet.
  useEffect(() => {
    if (!checkoutDialogOpen) return;
    const appliedBxgy = bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount;
    if (
      appliedBxgy &&
      appliedBxgy.customerGetsAnyItemsFrom === 'specific-collections' &&
      (appliedBxgy.getsCollectionIds?.length ?? 0) > 0 &&
      (!bxgySelectedGetsItems || bxgySelectedGetsItems.length === 0)
    ) {
      setBxgyChooseItemsModalOpen(true);
    }
  }, [
    checkoutDialogOpen,
    bxgyDiscountCodeResult,
    bxgyAppliedAutomaticDiscount,
    bxgySelectedGetsItems,
  ]);

  // Legacy discount-code handlers remain available via context

  const subtotal = useMemo(() => {
    return displayItems.reduce((sum, it) => {
      const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
      return sum + ((pv?.price ?? 0) * it.quantity);
    }, 0);
  }, [displayItems]);

  const tax = 0;

  // Compute total discount from applied discount codes
  type DiscountType = 'order' | 'product' | 'bxgy' | 'shipping';
  const appliedDiscounts = useMemo(() => {
    const list: { label: string; amount: number; type: DiscountType; description?: string }[] = [];
    if (aooDiscountCodeResult?.discountAmount) {
      list.push({
        label: aooDiscountCodeResult.title || aooDiscountCodeResult.discountCode || 'Amount off order',
        amount: aooDiscountCodeResult.discountAmount,
        type: 'order',
        description: aooDiscountCodeResult.message,
      });
    }
    if (aooAppliedAutomaticDiscount?.discountAmount) {
      list.push({
        label: aooAppliedAutomaticDiscount.title || aooAppliedAutomaticDiscount.discountCode || 'Amount off order',
        amount: aooAppliedAutomaticDiscount.discountAmount,
        type: 'order',
        description: aooAppliedAutomaticDiscount.message,
      });
    }
    if (aopDiscountCodeResult?.discountAmount) {
      list.push({
        label: aopDiscountCodeResult.title || aopDiscountCodeResult.discountCode || 'Amount off product',
        amount: aopDiscountCodeResult.discountAmount,
        type: 'product',
        description: aopDiscountCodeResult.message,
      });
    }
    if (aopAppliedAutomaticDiscount?.discountAmount) {
      list.push({
        label: aopAppliedAutomaticDiscount.title || aopAppliedAutomaticDiscount.discountCode || 'Amount off product',
        amount: aopAppliedAutomaticDiscount.discountAmount,
        type: 'product',
        description: aopAppliedAutomaticDiscount.message,
      });
    }
    const appliedBxgyForDiscount = bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount;
    if (appliedBxgyForDiscount) {
      const isCollectionGets = appliedBxgyForDiscount.customerGetsAnyItemsFrom === 'specific-collections';
      const amount =
        isCollectionGets && bxgySelectedGetsItems && bxgySelectedGetsItems.length > 0
          ? bxgySelectedGetsItems.reduce((sum, gi) => sum + gi.savings, 0)
          : appliedBxgyForDiscount.totalDiscountAmount ?? 0;
      if (amount > 0) {
        list.push({
          label: appliedBxgyForDiscount.title || appliedBxgyForDiscount.discountCode || 'Buy X Get Y',
          amount,
          type: 'bxgy',
          description: appliedBxgyForDiscount.discountSummary || appliedBxgyForDiscount.message,
        });
      }
    }
    if (discountCodeResult) {
      list.push({
        label: discountCodeResult.title || discountCodeResult.discountCode || 'Free shipping',
        amount: shippingCost,
        type: 'shipping',
        description: 'Free shipping on this order',
      });
    }
    if (appliedAutomaticDiscount) {
      list.push({
        label: appliedAutomaticDiscount.title || appliedAutomaticDiscount.discountCode || 'Free shipping',
        amount: shippingCost,
        type: 'shipping',
        description: 'Free shipping on this order',
      });
    }
    return list;
  }, [aooDiscountCodeResult, aooAppliedAutomaticDiscount, aopDiscountCodeResult, aopAppliedAutomaticDiscount, bxgyDiscountCodeResult, bxgyAppliedAutomaticDiscount, bxgySelectedGetsItems, discountCodeResult, appliedAutomaticDiscount, shippingCost]);

  const getDiscountBadge = (type: DiscountType) => {
    switch (type) {
      case 'shipping':
        return { text: 'Free Shipping', bg: 'bg-blue-100', color: 'text-blue-700' };
      case 'order':
        return { text: 'Order Discount', bg: 'bg-amber-100', color: 'text-amber-700' };
      case 'product':
        return { text: 'Product Discount', bg: 'bg-purple-100', color: 'text-purple-700' };
      case 'bxgy':
        return { text: 'Buy X Get Y', bg: 'bg-emerald-100', color: 'text-emerald-700' };
      default:
        return { text: 'Discount', bg: 'bg-gray-100', color: 'text-gray-700' };
    }
  };

  const totalDiscountAmount = useMemo(
    () => appliedDiscounts.reduce((sum, d) => sum + d.amount, 0),
    [appliedDiscounts]
  );

  const finalTotal = useMemo(
    () => Math.max(0, subtotal + shippingCost + tax - totalDiscountAmount),
    [subtotal, shippingCost, tax, totalDiscountAmount]
  );
  
  const handleCheckoutClick = () => {
    if (!user) {
      // User not logged in - show login prompt
      setLoginPromptOpen(true);
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

  const handleAddAddress = async () => {
    if (!user?._id) return;
    if (!newAddress.firstName || !newAddress.lastName || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.countryId || !newAddress.pinCode || !newAddress.phoneNumber) {
      return;
    }
    try {
      const created = await addCustomerAddress({
        customerId: user._id,
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        company: newAddress.company || undefined,
        address: newAddress.address,
        apartment: newAddress.apartment || undefined,
        city: newAddress.city,
        state: newAddress.state,
        countryId: newAddress.countryId,
        pinCode: newAddress.pinCode,
        phoneNumber: newAddress.phoneNumber,
        addressType: newAddress.addressType || 'home',
      });
      setSelectedShippingAddressId(created._id);
      setAddAddressModalOpen(false);
      setNewAddress({
        addressType: 'home',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        countryId: '',
        pinCode: '',
        phoneNumber: '',
      });
    } catch (err) {
      console.error('Failed to add address:', err);
    }
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
      let orderItems = items.map((item) => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        const price = pv?.price ?? 0;
        return { 
          productVariantId: typeof item.productVariantId === 'object' ? item.productVariantId._id : item.productVariantId, 
          quantity: item.quantity, 
          price, 
          total: price * item.quantity 
        };
      });

      const appliedBxgy = bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount;
      const getsItemsToUse =
        appliedBxgy?.customerGetsAnyItemsFrom === 'specific-collections' && bxgySelectedGetsItems && bxgySelectedGetsItems.length > 0
          ? bxgySelectedGetsItems
          : appliedBxgy?.getsItems ?? [];
      if (getsItemsToUse.length > 0) {
        const freeGetsItems = getsItemsToUse.map((gi) => ({
          productVariantId: gi.productVariantId ?? gi.productId,
          quantity: gi.quantity,
          price: gi.discountedPrice,
          total: gi.discountedPrice * gi.quantity,
        }));
        orderItems = [...orderItems, ...freeGetsItems];
      }

      if (!storeFrontMeta?.storeId) {
        throw new Error('Store ID is required');
      }
      console.log('Placing order with items:', orderItems);
      const freeShippingDiscountId =
        (appliedAutomaticDiscount?.id || discountCodeResult?.id) ?? undefined;
      const amountOffOrderDiscountId =
        (aooAppliedAutomaticDiscount?.id || aooDiscountCodeResult?.id) ?? undefined;
      const amountOffProductDiscountId =
        (aopAppliedAutomaticDiscount?.id || aopDiscountCodeResult?.id) ?? undefined;
      const buyXGetYDiscountId = appliedBxgy?.id ?? undefined;

      await createOrder({
        storeId: storeFrontMeta.storeId,
        shippingAddressId: selectedShippingAddressId,
        billingAddressId: selectedBillingAddressId || undefined,
        items: orderItems,
        paymentMethod: 'cod',
        subtotal,
        tax,
        shippingCost,
        total: finalTotal,
        ...(freeShippingDiscountId && { freeShippingDiscountId }),
        ...(amountOffOrderDiscountId && { amountOffOrderDiscountId }),
        ...(amountOffProductDiscountId && { amountOffProductDiscountId }),
        ...(buyXGetYDiscountId && { buyXGetYDiscountId }),
      });
      console.log('Order placed successfully');
      setCheckoutDialogOpen(false);
      await Promise.all(items.map(item => deleteCartEntry(item._id).catch(() => {})));
      clear();
      onClose();
      navigate('/order-success');
    } catch (error) { 
      console.error('Failed to create order:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <>
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[var(--charcoal-black)]/45 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer — Ornativa theme: ivory panel, warm border, above footer UI (z-100) */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--warm-beige)] bg-[var(--ivory-white)] shadow-[-12px_0_48px_rgba(12,16,12,0.12)]"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[var(--warm-beige)] bg-white/90 px-5 py-4 backdrop-blur-md">
              <div>
                <h2
                  className="text-[1.15rem] font-semibold tracking-tight text-[var(--charcoal-black)]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Shopping bag
                </h2>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--soft-charcoal)]/80">
                  {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2.5 text-[var(--soft-charcoal)] transition-colors hover:bg-[var(--champagne-beige)] hover:text-[var(--charcoal-black)]"
                aria-label="Close cart"
              >
                <FiX className="h-5 w-5" strokeWidth={2} />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col">
              {displayItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[var(--warm-beige)] bg-[var(--champagne-beige)]/60">
                    <FiShoppingBag className="h-11 w-11 text-[var(--gold)]/40" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--charcoal-black)]" style={{ fontFamily: 'var(--font-serif)' }}>
                    Your bag is empty
                  </p>
                  <p className="mt-2 max-w-[240px] text-sm text-[var(--soft-charcoal)]/90">
                    Discover pieces you love and add them here.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-8 rounded-full bg-[var(--charcoal-black)] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2b1e1e]"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <>
                  {!user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mx-4 mt-4 shrink-0 rounded-2xl border border-[var(--warm-beige)] bg-gradient-to-r from-[var(--champagne-beige)]/80 to-white px-4 py-3.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-[var(--charcoal-black)]">Sign in</p>
                          <p className="text-xs text-[var(--soft-charcoal)]">Sync your cart across devices</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate('/auth/login');
                          }}
                          className="shrink-0 rounded-full border border-[var(--charcoal-black)] bg-white px-4 py-2 text-xs font-semibold text-[var(--charcoal-black)] transition hover:bg-[var(--champagne-beige)]"
                        >
                          Sign in
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 pt-4">
                    <div className="space-y-3">
                      {displayItems.map((it, index) => {
                        const pv = typeof it.productVariantId === 'object' ? it.productVariantId : null;
                        const image = pv?.images?.[0];
                        const title = pv?.sku || 'Product';
                        const price = pv?.price ?? 0;
                        const compareAtPrice = pv?.compareAtPrice ?? null;
                        const productId = pv?.productId;
                        const handleProductClick = () => {
                          if (productId) {
                            onClose();
                            navigate(`/products/${productId}`);
                          }
                        };
                        return (
                          <motion.div
                            key={it._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="flex gap-3.5 rounded-2xl border border-[var(--warm-beige)] bg-white p-3.5 shadow-[var(--shadow-light)]"
                          >
                            <button
                              type="button"
                              className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--warm-beige)] bg-[var(--champagne-beige)]/50"
                              onClick={handleProductClick}
                              aria-label={productId ? `View ${title}` : undefined}
                            >
                              <img
                                src={image || 'https://via.placeholder.com/96'}
                                alt=""
                                className="h-full w-full object-contain p-1"
                              />
                            </button>
                            <div className="min-w-0 flex-1 text-left">
                              {productId ? (
                                <button
                                  type="button"
                                  onClick={handleProductClick}
                                  className="text-left text-[0.9375rem] font-semibold leading-snug text-[var(--charcoal-black)] hover:text-[var(--gold)]"
                                >
                                  {title}
                                </button>
                              ) : (
                                <p className="text-[0.9375rem] font-semibold text-[var(--charcoal-black)]">{title}</p>
                              )}
                              {pv?.optionValues && (
                                <p className="mt-0.5 text-xs leading-relaxed text-[var(--soft-charcoal)]">
                                  {Object.entries(pv.optionValues)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' · ')}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                <span className="text-sm font-semibold tabular-nums text-[var(--charcoal-black)]">
                                  {formatINR(price * it.quantity)}
                                </span>
                                {compareAtPrice != null && compareAtPrice > price && (
                                  <span className="text-xs tabular-nums text-[var(--soft-charcoal)] line-through">
                                    {formatINR(compareAtPrice * it.quantity)}
                                  </span>
                                )}
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <div className="inline-flex items-center rounded-full border border-[var(--warm-beige)] bg-[var(--ivory-white)] p-0.5">
                                  <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-[var(--charcoal-black)] transition hover:bg-[var(--champagne-beige)]"
                                    onClick={() => updateCartEntry({ id: it._id, quantity: Math.max(1, it.quantity - 1) })}
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className="min-w-[1.75rem] text-center text-sm font-semibold tabular-nums text-[var(--charcoal-black)]">
                                    {it.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-[var(--charcoal-black)] transition hover:bg-[var(--champagne-beige)]"
                                    onClick={() => updateCartEntry({ id: it._id, quantity: it.quantity + 1 })}
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => deleteCartEntry(it._id)}
                                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[var(--soft-charcoal)] transition hover:bg-red-50 hover:text-red-600"
                                  aria-label="Remove item"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="shrink-0 border-t border-[var(--warm-beige)] bg-gradient-to-b from-white to-[var(--champagne-beige)]/30 px-4 pb-6 pt-6"
                  >
                    <h3
                      className="mb-4 text-base font-semibold text-[var(--charcoal-black)]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      Order summary
                    </h3>
                    {displayItems.length > 0 && (
                      <div className="mb-4 rounded-2xl border border-[var(--warm-beige)] bg-white/80 p-3.5 text-xs leading-relaxed text-[var(--soft-charcoal)] shadow-[var(--shadow-light)]">
                        {discountsOffersLoading ? (
                          <p className="text-[var(--charcoal-black)]">Calculating the best offers for your bag…</p>
                        ) : appliedDiscounts.length > 0 ? (
                          <>
                            <p className="font-semibold text-[var(--charcoal-black)]" style={{ fontFamily: 'var(--font-serif)' }}>
                              We&apos;ve applied the best compatible discounts for you.
                            </p>
                            <p className="mt-1.5 text-[11px] text-[var(--soft-charcoal)]">
                              These offers work together and give you the highest savings right now.
                            </p>
                            <ul className="mt-2.5 space-y-1.5 border-t border-[var(--warm-beige)] pt-2.5">
                              {appliedDiscounts.map((d, idx) => {
                                const badge = getDiscountBadge(d.type);
                                return (
                                  <li key={`${d.type}-${idx}`} className="flex items-start justify-between gap-2">
                                    <span className="min-w-0 flex-1">
                                      <span
                                        className={`mr-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.bg} ${badge.color}`}
                                      >
                                        {badge.text}
                                      </span>
                                      <span className="text-[var(--charcoal-black)]">{d.label}</span>
                                    </span>
                                    <span className="shrink-0 font-semibold tabular-nums text-emerald-700">−{formatINR(d.amount)}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        ) : (
                          <p>No automatic stackable discounts apply to this bag yet. You can still enter a code at checkout.</p>
                        )}
                      </div>
                    )}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-[var(--soft-charcoal)]">
                        <span>Subtotal</span>
                        <span className="font-medium tabular-nums text-[var(--charcoal-black)]">{formatINR(subtotal)}</span>
                      </div>
                      {totalDiscountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount</span>
                          <span className="font-semibold tabular-nums">−{formatINR(totalDiscountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[var(--soft-charcoal)]">
                        <span>Shipping</span>
                        <span className="font-medium tabular-nums text-[var(--charcoal-black)]">
                          {totalDiscountAmount > 0 && (discountCodeResult || appliedAutomaticDiscount)
                            ? 'Free'
                            : shippingCost <= 0
                              ? 'Free'
                              : formatINR(shippingCost)}
                        </span>
                      </div>
                      <div className="my-3 h-px bg-[var(--warm-beige)]" />
                      <div className="flex justify-between text-base font-semibold text-[var(--charcoal-black)]">
                        <span>Total</span>
                        <span className="tabular-nums">{formatINR(finalTotal)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckoutClick}
                      disabled={displayItems.length === 0}
                      className="mt-5 w-full rounded-full bg-[var(--charcoal-black)] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#2b1e1e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Proceed to checkout
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full rounded-full border border-[var(--warm-beige)] bg-white py-3 text-sm font-medium text-[var(--charcoal-black)] transition hover:border-[var(--gold)]/50 hover:bg-[var(--champagne-beige)]/50"
                    >
                      Continue shopping
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>

      {/* Quick Checkout Popup (Pay Now from Cart) – Boat-style UI */}
      {checkoutDialogOpen && (
        <div
          className="checkout-page fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
          style={{ position: 'fixed' }}
          onClick={() => setCheckoutDialogOpen(false)}
        >
          <div
            className="checkout-inner checkout-drawer-modal bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl font-sans flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top savings & items bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#0b1220] text-white text-xs sm:text-sm">
              <div className="font-semibold">
                {formatINR(totalDiscountAmount)} saved so far
              </div>
              <div className="flex items-center gap-2">
                {totalDiscountAmount > 0 && (
                  <span className="line-through opacity-80 text-[11px] sm:text-xs">
                    {formatINR(finalTotal + totalDiscountAmount)}
                  </span>
                )}
                <span className="font-semibold text-sm sm:text-base">
                  {formatINR(finalTotal)}
                </span>
                <span className="text-[11px] sm:text-xs opacity-80">
                  {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutDialogOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-[#0c100c]" />
                </button>
                <h2
                  className="text-lg font-semibold text-[#0c100c]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {storeFrontMeta?.name || 'Store'}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>100% Secured Payment</span>
                <FiLock className="w-4 h-4 text-gray-700" />
              </div>
            </div>

            <div ref={checkoutScrollContainerRef} className="p-0 overflow-y-auto flex-1" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {/* Offers & Rewards (top coupon-style area) */}
              <div className="px-6 pt-4 pb-2">
                <div
                  className={`rounded-2xl border overflow-hidden ${
                    appliedDiscounts.length > 0
                      ? 'border-emerald-200 bg-emerald-50/60'
                      : 'border-gray-200 bg-gray-50/60'
                  }`}
                >
                  <div className="p-4">
                    <div className="relative mb-2">
                      <div
                        className={`w-full pl-3 pr-3 py-2.5 text-sm border rounded-lg flex items-center justify-between ${
                          appliedDiscounts.length > 0
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-gray-300 bg-white text-gray-700'
                        }`}
                      >
                        {appliedDiscounts.length > 0 ? (
                          <span className="truncate flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {appliedDiscounts.length} offer{appliedDiscounts.length > 1 ? 's' : ''} applied! You save {formatINR(totalDiscountAmount)}
                          </span>
                        ) : (
                          <span className="truncate">
                            Best coupons and offers are applied automatically
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {appliedDiscounts.length > 0
                          ? 'Scroll down to see applied offers'
                          : 'No offers applied to your cart'}
                      </span>
                      {appliedDiscounts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (appliedOffersRef.current && checkoutScrollContainerRef.current) {
                              const container = checkoutScrollContainerRef.current;
                              const element = appliedOffersRef.current;
                              const offsetTop = element.offsetTop - container.offsetTop;
                              container.scrollTo({ top: offsetTop, behavior: 'smooth' });
                            }
                          }}
                          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          View details below
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <BxgyCheckoutGetsSection
                appliedBxgy={bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount}
                eligibleBxgy={bxgyEligibleDiscounts[0] ?? null}
                selectedGetsItems={bxgySelectedGetsItems}
                onChooseItemsClick={() => setBxgyChooseItemsModalOpen(true)}
              />

              {/* Login / phone entry section - Only show when NOT logged in */}
              {!user && (
                <div className="px-6 pb-4">
                  <div className="rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-amber-100 text-amber-900 text-xs font-medium px-4 py-2">
                      Login to redeem rewards or giftcard balance
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Login to continue</p>
                        <p className="text-xs text-gray-600 mb-3">
                          Enter mobile number to receive order updates.
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700">
                            +91
                          </span>
                          <input
                            type="tel"
                            placeholder="Enter mobile number"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none bg-white text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 text-center">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                          Powered by
                        </p>
                        <img src={ZiplofyLogo} alt="Ziplofy" className="h-8 mx-auto mb-2 object-contain" />
                        <div className="flex items-center justify-center gap-6 text-[10px] text-gray-500">
                          <span>PCI DSS Certified</span>
                          <span>100% Secured Payments</span>
                          <span>Verified Merchant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery details */}
              <div className="px-6 pb-4">
                <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin className="w-5 h-5 text-amber-600" />
                      <h3 className="text-sm font-normal text-gray-900">
                        Deliver to {user?.firstName || ''}
                      </h3>
                    </div>
                    <p className="text-sm font-normal text-gray-600 whitespace-pre-wrap">
                      {addresses.find((a) => a._id === selectedShippingAddressId)?.address ||
                        'Select a shipping address'}
                    </p>
                    {user?.email && (
                      <p className="text-sm font-normal text-gray-500 mt-1">{user.email}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-normal text-gray-700">
                        Shipping Address
                      </label>
                      <button
                        type="button"
                        onClick={() => setAddAddressModalOpen(true)}
                        className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        + Add New
                      </button>
                    </div>
                    {addresses.length === 0 ? (
                      <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
                        <p className="text-sm font-normal text-gray-600 mb-3">
                          No addresses found
                        </p>
                        <button
                          type="button"
                          onClick={() => setAddAddressModalOpen(true)}
                          className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
                        >
                          Add Address
                        </button>
                      </div>
                    ) : (
                      <select
                        value={selectedShippingAddressId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setSelectedShippingAddressId(e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm font-normal border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none bg-white text-gray-900"
                      >
                        {addresses.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.firstName} {a.lastName} — {a.city}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Applied Offers Section */}
              {appliedDiscounts.length > 0 && (
                <div ref={appliedOffersRef} className="px-6 pb-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        Applied Offers
                      </h3>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {appliedDiscounts.length} {appliedDiscounts.length === 1 ? 'offer' : 'offers'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {appliedDiscounts.map((d, idx) => {
                        const badge = getDiscountBadge(d.type);
                        return (
                          <div
                            key={`${d.label}-${idx}`}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-gray-100"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span
                                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${badge.bg} ${badge.color}`}
                                >
                                  {badge.text}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-gray-800 truncate">{d.label}</p>
                              {d.description && (
                                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{d.description}</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs font-semibold text-emerald-600">
                                −{formatINR(d.amount)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Total Savings</span>
                      <span className="text-sm font-bold text-emerald-600">
                        −{formatINR(totalDiscountAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Summary */}
              <div className="px-6 pb-5">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-normal text-gray-900 mb-4">Cost summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-normal text-gray-600">Subtotal</span>
                      <span className="font-normal text-gray-900">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-normal text-gray-600">Shipping</span>
                      <span className="font-normal text-gray-900">
                        {discountCodeResult || appliedAutomaticDiscount ? (
                          <span className="flex items-center gap-2">
                            <span className="line-through text-gray-400">
                              {formatINR(shippingCost)}
                            </span>
                            <span className="text-green-600 font-medium">Free</span>
                          </span>
                        ) : shippingCost <= 0 ? (
                          'Free'
                        ) : (
                          formatINR(shippingCost)
                        )}
                      </span>
                    </div>
                    {totalDiscountAmount > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setDiscountBreakdownExpanded(!discountBreakdownExpanded)}
                          className="w-full flex justify-between items-center cursor-pointer"
                        >
                          <span className="font-normal text-gray-600 flex items-center gap-1">
                            Discount ({appliedDiscounts.length} offer{appliedDiscounts.length > 1 ? 's' : ''})
                            <svg
                              className={`w-4 h-4 text-gray-500 transition-transform ${discountBreakdownExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                          <span className="font-medium text-emerald-600">
                            −{formatINR(totalDiscountAmount)}
                          </span>
                        </button>
                        {discountBreakdownExpanded && (
                          <div className="mt-2 ml-2 pl-3 border-l-2 border-emerald-200 space-y-1.5">
                            {appliedDiscounts.map((d, idx) => (
                              <div key={`breakdown-${d.label}-${idx}`} className="flex justify-between text-xs">
                                <span className="text-gray-500 truncate max-w-[180px]" title={d.label}>
                                  {d.label}
                                </span>
                                <span className="text-emerald-600">−{formatINR(d.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">To Pay</span>
                      <span className="font-semibold text-gray-900">{formatINR(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom primary action */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedShippingAddressId || orderLoading || addresses.length === 0}
                className="w-full px-6 py-3 text-sm rounded-full bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={
                  addresses.length === 0
                    ? 'Please add a shipping address first'
                    : !selectedShippingAddressId
                    ? 'Please select a shipping address'
                    : ''
                }
              >
                {orderLoading ? 'Processing...' : `Pay ${formatINR(finalTotal)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BXGY "Choose items" modal for gets-from-collection discounts */}
      {(bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount) &&
        (bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount)?.customerGetsAnyItemsFrom === 'specific-collections' &&
        (bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount)?.getsCollectionIds?.length && (
        <BxgyChooseItemsModal
          open={bxgyChooseItemsModalOpen}
          onClose={() => setBxgyChooseItemsModalOpen(false)}
          discount={bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount!}
          onConfirm={(items) => {
            setBxgySelectedGetsItems(items);
            setBxgyChooseItemsModalOpen(false);
          }}
        />
      )}

      {/* Add Address Modal */}
      {addAddressModalOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAddAddressModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Address</h2>
              <button
                type="button"
                onClick={() => setAddAddressModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {/* Address Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  value={newAddress.addressType}
                  onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none bg-white"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.firstName}
                    onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.lastName}
                    onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Company (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.company}
                  onChange={(e) => setNewAddress({ ...newAddress, company: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  placeholder="Company name"
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none"
                  placeholder="Street address, house number"
                  rows={2}
                />
              </div>

              {/* Apartment / Suite */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc. (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.apartment}
                  onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  placeholder="Apt, suite, unit, etc."
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              {/* Country & Postal Code */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAddress.countryId}
                    onChange={(e) => setNewAddress({ ...newAddress, countryId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none bg-white"
                    disabled={countriesLoading}
                  >
                    {countriesLoading ? (
                      <option value="">Loading countries...</option>
                    ) : countries.length === 0 ? (
                      <option value="">No countries available</option>
                    ) : (
                      countries.map((country) => (
                        <option key={country._id} value={country._id}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.pinCode}
                    onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                    placeholder="400001"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newAddress.phoneNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={() => setAddAddressModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAddress}
                disabled={addressLoading || !newAddress.firstName || !newAddress.lastName || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.countryId || !newAddress.pinCode || !newAddress.phoneNumber}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addressLoading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal for Guest Checkout */}
      {loginPromptOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setLoginPromptOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <FiLock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sign in to checkout
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Please sign in or create an account to complete your purchase. Your cart items will be saved.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLoginPromptOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginPromptOpen(false);
                    onClose();
                    navigate('/auth/login');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
