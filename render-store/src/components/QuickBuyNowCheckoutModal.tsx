/**
 * Single-product checkout (Buy now) without adding to cart.
 * Reuses the same discount APIs and createOrder payload shape as CartDrawer checkout.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMapPin, FiX } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import { useFreeShipping } from '../contexts/storefront-free-shipping.context';
import { useAmountOffOrder } from '../contexts/amount-off-order.context';
import { useAmountOffProduct } from '../contexts/amount-off-product.context';
import { useBuyXGetY } from '../contexts/buy-x-get-y.context';
import type { BuyXGetYCartItem } from '../contexts/buy-x-get-y.context';
import type { StorefrontProductVariant } from '../contexts/product-variant.context';
import { useStorefrontCountries } from '../contexts/storefront-country.context';
import { BxgyChooseItemsModal } from './BxgyChooseItemsModal';
import { BxgyCheckoutGetsSection } from './BxgyCheckoutGetsSection';
import { formatINR } from '../utils/currency';
import { savePendingCheckout } from '../utils/pendingCheckout';
import type { CreateOrderPayload } from '../contexts/storefront-order.context';

export type BuyNowCheckoutLine = {
  variant: StorefrontProductVariant;
  quantity: number;
  productTitle: string;
  productImage?: string;
};

export interface QuickBuyNowCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  line: BuyNowCheckoutLine | null;
}

export const QuickBuyNowCheckoutModal: React.FC<QuickBuyNowCheckoutModalProps> = ({
  open,
  onClose,
  line,
}) => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { user, checkAuth } = useStorefrontAuth();
  const { addresses, fetchCustomerAddressesByCustomerId, addCustomerAddress, loading: addressLoading } =
    useCustomerAddresses();
  const { countries, getCountries, loading: countriesLoading } = useStorefrontCountries();
  const { loading: orderLoading } = useStorefrontOrder();

  const {
    eligibleDiscounts,
    discountCodeResult,
    appliedAutomaticDiscount,
    checkEligibleFreeShippingDiscounts,
    applyAutomaticDiscount,
    clearAppliedAutomaticDiscount,
  } = useFreeShipping();
  const {
    eligibleDiscounts: aooEligibleDiscounts,
    discountCodeResult: aooDiscountCodeResult,
    appliedAutomaticDiscount: aooAppliedAutomaticDiscount,
    fetchEligibleDiscounts: fetchAooEligibleDiscounts,
    applyAutomaticDiscount: applyAooAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearAooAppliedAutomaticDiscount,
  } = useAmountOffOrder();
  const {
    eligibleDiscounts: aopEligibleDiscounts,
    discountCodeResult: aopDiscountCodeResult,
    appliedAutomaticDiscount: aopAppliedAutomaticDiscount,
    fetchEligibleDiscounts: fetchAopEligibleDiscounts,
    applyAutomaticDiscount: applyAopAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearAopAppliedAutomaticDiscount,
  } = useAmountOffProduct();
  const {
    eligibleDiscounts: bxgyEligibleDiscounts,
    discountCodeResult: bxgyDiscountCodeResult,
    appliedAutomaticDiscount: bxgyAppliedAutomaticDiscount,
    selectedGetsItems: bxgySelectedGetsItems,
    setSelectedGetsItems: setBxgySelectedGetsItems,
    fetchEligibleDiscounts: fetchBxgyEligibleDiscounts,
    applyAutomaticDiscount: applyBxgyAutomaticDiscount,
    clearAppliedAutomaticDiscount: clearBxgyAppliedAutomaticDiscount,
  } = useBuyXGetY();

  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState('');
  const [selectedBillingAddressId] = useState('');
  const [bxgyChooseItemsModalOpen, setBxgyChooseItemsModalOpen] = useState(false);
  const [discountBreakdownExpanded, setDiscountBreakdownExpanded] = useState(false);
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

  const appliedOffersRef = useRef<HTMLDivElement>(null);
  const checkoutScrollContainerRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  const checkoutActive = open && !!line && !!user?._id;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!open || !user?._id) return;
    fetchCustomerAddressesByCustomerId(user._id).catch(() => {});
  }, [open, user?._id, fetchCustomerAddressesByCustomerId]);

  useEffect(() => {
    if (!checkoutActive || !user) return;
    if (user.defaultAddress) {
      setSelectedShippingAddressId(user.defaultAddress);
    } else if (addresses.length > 0) {
      setSelectedShippingAddressId(addresses[0]._id);
    }
  }, [checkoutActive, user, addresses]);

  useEffect(() => {
    if (addAddressModalOpen && countries.length === 0) {
      getCountries({ limit: 300 }).catch(() => {});
    }
  }, [addAddressModalOpen, countries.length, getCountries]);

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

  const cartItemsForApi = useMemo(() => {
    if (!line) return [];
    const v = line.variant;
    const price = v.price ?? 0;
    return [
      {
        productId: v._id,
        quantity: line.quantity,
        price,
      },
    ];
  }, [line]);

  const buyXGetYCartItems = useMemo((): BuyXGetYCartItem[] => {
    if (!line) return [];
    const v = line.variant;
    const price = v.price ?? 0;
    const productId = v.productId ?? v._id;
    return [
      {
        productId,
        collectionIds: (v as unknown as { collectionIds?: string[] }).collectionIds,
        quantity: line.quantity,
        price,
      },
    ];
  }, [line]);

  const cartItemsKey = useMemo(
    () => JSON.stringify(cartItemsForApi.map((c) => `${c.productId}:${c.quantity}:${c.price}`)),
    [cartItemsForApi]
  );
  const bxgyCartItemsKey = useMemo(
    () => JSON.stringify(buyXGetYCartItems.map((c) => `${c.productId}:${c.quantity}:${c.price}`)),
    [buyXGetYCartItems]
  );

  const selectedAddrData = addresses.find((a) => a._id === selectedShippingAddressId);
  const shippingCountryIso2 = (selectedAddrData?.countryId as { iso2?: string })?.iso2;

  useEffect(() => {
    if (!checkoutActive || !storeFrontMeta?.storeId || !user?._id || cartItemsForApi.length === 0) return;
    const selectedAddr = addresses.find((a) => a._id === selectedShippingAddressId);
    checkEligibleFreeShippingDiscounts({
      storeId: storeFrontMeta.storeId,
      customerId: user._id,
      cartItems: cartItemsForApi,
      shippingAddress: selectedAddr
        ? {
            country: (selectedAddr.countryId as { iso2?: string })?.iso2,
            countryId:
              typeof selectedAddr.countryId === 'object'
                ? (selectedAddr.countryId as { _id?: string })?._id
                : selectedAddr.countryId,
            state: selectedAddr.state,
            city: selectedAddr.city,
          }
        : undefined,
    }).catch(() => {});
  }, [
    checkoutActive,
    storeFrontMeta?.storeId,
    user?._id,
    selectedShippingAddressId,
    cartItemsKey,
    shippingCountryIso2,
    checkEligibleFreeShippingDiscounts,
    addresses,
    cartItemsForApi,
  ]);

  useEffect(() => {
    if (!checkoutActive || !storeFrontMeta?.storeId || cartItemsForApi.length === 0) return;
    fetchAooEligibleDiscounts(storeFrontMeta.storeId, user?._id ?? null, cartItemsForApi).catch(() => {});
  }, [checkoutActive, storeFrontMeta?.storeId, user?._id, cartItemsKey, fetchAooEligibleDiscounts, cartItemsForApi]);

  useEffect(() => {
    if (!checkoutActive || !storeFrontMeta?.storeId || buyXGetYCartItems.length === 0) return;
    fetchAopEligibleDiscounts(storeFrontMeta.storeId, user?._id ?? null, buyXGetYCartItems).catch(() => {});
  }, [
    checkoutActive,
    storeFrontMeta?.storeId,
    user?._id,
    bxgyCartItemsKey,
    fetchAopEligibleDiscounts,
    buyXGetYCartItems,
  ]);

  useEffect(() => {
    if (!checkoutActive || !storeFrontMeta?.storeId || buyXGetYCartItems.length === 0) return;
    fetchBxgyEligibleDiscounts(storeFrontMeta.storeId, user?._id ?? null, buyXGetYCartItems).catch(() => {});
  }, [
    checkoutActive,
    storeFrontMeta?.storeId,
    user?._id,
    bxgyCartItemsKey,
    fetchBxgyEligibleDiscounts,
    buyXGetYCartItems,
  ]);

  const shippingCost = 20000;

  const areDiscountsCompatible = (
    d1: {
      type: 'shipping' | 'order' | 'product' | 'bxgy';
      combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean };
    },
    d2: {
      type: 'shipping' | 'order' | 'product' | 'bxgy';
      combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean };
    }
  ): boolean => {
    const getRequiredField = (targetType: string): 'productDiscounts' | 'orderDiscounts' | 'shippingDiscounts' => {
      if (targetType === 'shipping') return 'shippingDiscounts';
      if (targetType === 'order') return 'orderDiscounts';
      return 'productDiscounts';
    };
    const d1AllowsD2 = (() => {
      const field = getRequiredField(d2.type);
      if (field === 'shippingDiscounts') {
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

  const isValidCombination = (
    discounts: Array<{
      type: 'shipping' | 'order' | 'product' | 'bxgy';
      combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean };
      amount: number;
    }>
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

  useEffect(() => {
    if (!checkoutActive) return;

    const candidates: Array<{
      type: 'shipping' | 'order' | 'product' | 'bxgy';
      discount: any;
      amount: number;
      combinations: { productDiscounts: boolean; orderDiscounts: boolean; shippingDiscounts?: boolean };
      apply: () => void;
      clear: () => void;
      currentlyApplied: any;
    }> = [];

    if (!discountCodeResult && eligibleDiscounts.length > 0) {
      const best = eligibleDiscounts[0];
      candidates.push({
        type: 'shipping',
        discount: best,
        amount: shippingCost,
        combinations: best.combinations || { productDiscounts: true, orderDiscounts: true },
        apply: () => applyAutomaticDiscount(best),
        clear: clearAppliedAutomaticDiscount,
        currentlyApplied: appliedAutomaticDiscount,
      });
    }

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

    if (candidates.length === 0) {
      if (appliedAutomaticDiscount) clearAppliedAutomaticDiscount();
      if (aooAppliedAutomaticDiscount) clearAooAppliedAutomaticDiscount();
      if (aopAppliedAutomaticDiscount) clearAopAppliedAutomaticDiscount();
      if (bxgyAppliedAutomaticDiscount) clearBxgyAppliedAutomaticDiscount();
      return;
    }

    let bestCombination: typeof candidates = [];
    let bestSavings = 0;
    const n = candidates.length;
    for (let mask = 1; mask < 1 << n; mask++) {
      const subset: typeof candidates = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) subset.push(candidates[i]);
      }
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

    const typesToApply = new Set(bestCombination.map((c) => c.type));

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

    for (const candidate of bestCombination) {
      const isAlreadyApplied = candidate.currentlyApplied?.id === candidate.discount.id;
      if (!isAlreadyApplied) {
        candidate.apply();
      }
    }
  }, [
    checkoutActive,
    shippingCost,
    eligibleDiscounts,
    discountCodeResult,
    appliedAutomaticDiscount,
    applyAutomaticDiscount,
    clearAppliedAutomaticDiscount,
    aooEligibleDiscounts,
    aooDiscountCodeResult,
    aooAppliedAutomaticDiscount,
    applyAooAutomaticDiscount,
    clearAooAppliedAutomaticDiscount,
    aopEligibleDiscounts,
    aopDiscountCodeResult,
    aopAppliedAutomaticDiscount,
    applyAopAutomaticDiscount,
    clearAopAppliedAutomaticDiscount,
    bxgyEligibleDiscounts,
    bxgyDiscountCodeResult,
    bxgyAppliedAutomaticDiscount,
    applyBxgyAutomaticDiscount,
    clearBxgyAppliedAutomaticDiscount,
  ]);

  useEffect(() => {
    if (!checkoutActive) return;
    const appliedBxgy = bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount;
    if (
      appliedBxgy &&
      appliedBxgy.customerGetsAnyItemsFrom === 'specific-collections' &&
      (appliedBxgy.getsCollectionIds?.length ?? 0) > 0 &&
      (!bxgySelectedGetsItems || bxgySelectedGetsItems.length === 0)
    ) {
      setBxgyChooseItemsModalOpen(true);
    }
  }, [checkoutActive, bxgyDiscountCodeResult, bxgyAppliedAutomaticDiscount, bxgySelectedGetsItems]);

  const subtotal = useMemo(() => {
    if (!line) return 0;
    return (line.variant.price ?? 0) * line.quantity;
  }, [line]);

  const tax = 0;

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
  }, [
    aooDiscountCodeResult,
    aooAppliedAutomaticDiscount,
    aopDiscountCodeResult,
    aopAppliedAutomaticDiscount,
    bxgyDiscountCodeResult,
    bxgyAppliedAutomaticDiscount,
    bxgySelectedGetsItems,
    discountCodeResult,
    appliedAutomaticDiscount,
    shippingCost,
  ]);

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

  const resetDiscountContexts = useCallback(() => {
    clearAppliedAutomaticDiscount();
    clearAooAppliedAutomaticDiscount();
    clearAopAppliedAutomaticDiscount();
    clearBxgyAppliedAutomaticDiscount();
    setBxgySelectedGetsItems(null);
  }, [
    clearAppliedAutomaticDiscount,
    clearAooAppliedAutomaticDiscount,
    clearAopAppliedAutomaticDiscount,
    clearBxgyAppliedAutomaticDiscount,
    setBxgySelectedGetsItems,
  ]);

  useEffect(() => {
    if (prevOpenRef.current && !open) {
      resetDiscountContexts();
      setDiscountBreakdownExpanded(false);
      setBxgyChooseItemsModalOpen(false);
    }
    prevOpenRef.current = open;
  }, [open, resetDiscountContexts]);

  const handleClose = () => {
    onClose();
  };

  const handleAddAddress = async () => {
    if (!user?._id) return;
    if (
      !newAddress.firstName ||
      !newAddress.lastName ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.countryId ||
      !newAddress.pinCode ||
      !newAddress.phoneNumber
    ) {
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

  const buildQuickBuyOrderPayload = (): CreateOrderPayload | null => {
    if (!selectedShippingAddressId || !user?._id || !line || !storeFrontMeta?.storeId) {
      return null;
    }
    const v = line.variant;
    const price = v.price ?? 0;
    let orderItems = [
      {
        productVariantId: v._id,
        quantity: line.quantity,
        price,
        total: price * line.quantity,
      },
    ];

    const appliedBxgy = bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount;
    const getsItemsToUse =
      appliedBxgy?.customerGetsAnyItemsFrom === 'specific-collections' &&
      bxgySelectedGetsItems &&
      bxgySelectedGetsItems.length > 0
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

    const freeShippingDiscountId =
      (appliedAutomaticDiscount?.id || discountCodeResult?.id) ?? undefined;
    const amountOffOrderDiscountId =
      (aooAppliedAutomaticDiscount?.id || aooDiscountCodeResult?.id) ?? undefined;
    const amountOffProductDiscountId =
      (aopAppliedAutomaticDiscount?.id || aopDiscountCodeResult?.id) ?? undefined;
    const buyXGetYDiscountId = appliedBxgy?.id ?? undefined;

    return {
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
    };
  };

  const goToCheckoutPayment = () => {
    const payload = buildQuickBuyOrderPayload();
    if (!payload) return;
    const pending = {
      createOrderPayload: payload,
      cartEntryIds: [] as string[],
      merchantName: storeFrontMeta?.name || 'Store',
      itemSummaryLine: line ? `${line.quantity} × ${line.productTitle}` : '1 item',
      amountPaise: finalTotal,
      orderIdDisplay: `ORD-${Date.now().toString(36).toUpperCase()}`,
    };
    savePendingCheckout(pending);
    resetDiscountContexts();
    handleClose();
    navigate('/checkout/payment', { state: { pending } });
  };

  if (!open || !line || !user) {
    return null;
  }

  const img = line.productImage || line.variant.images?.[0] || 'https://via.placeholder.com/96';
  const v = line.variant;

  return (
    <>
      <div
        className="checkout-page fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        onClick={handleClose}
      >
        <div
          className="checkout-inner checkout-drawer-modal bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl font-sans flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-3 bg-[#0b1220] text-white text-xs sm:text-sm">
            <div className="font-semibold">{formatINR(totalDiscountAmount)} saved so far</div>
            <div className="flex items-center gap-2">
              {totalDiscountAmount > 0 && (
                <span className="line-through opacity-80 text-[11px] sm:text-xs">
                  {formatINR(finalTotal + totalDiscountAmount)}
                </span>
              )}
              <span className="font-semibold text-sm sm:text-base">{formatINR(finalTotal)}</span>
              <span className="text-[11px] sm:text-xs opacity-80">1 item</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2
                  className="text-lg font-semibold text-[#0c100c]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Buy now — {storeFrontMeta?.name || 'Store'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>100% Secured Payment</span>
              <FiLock className="w-4 h-4 text-gray-700" />
            </div>
          </div>

          <div
            ref={checkoutScrollContainerRef}
            className="p-0 overflow-y-auto flex-1"
            style={{ maxHeight: 'calc(85vh - 180px)' }}
          >
            <div className="px-6 pt-4 pb-3 flex gap-3 border-b border-gray-100">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-white">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{line.productTitle}</p>
                {v.optionValues && Object.keys(v.optionValues).length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {Object.entries(v.optionValues)
                      .map(([k, val]) => `${k}: ${val}`)
                      .join(', ')}
                  </p>
                )}
                <p className="text-sm text-gray-800 mt-1">
                  Qty {line.quantity} · {formatINR(subtotal)}
                </p>
              </div>
            </div>

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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {appliedDiscounts.length} offer{appliedDiscounts.length > 1 ? 's' : ''} applied! You save{' '}
                          {formatINR(totalDiscountAmount)}
                        </span>
                      ) : (
                        <span className="truncate">Best coupons and offers are applied automatically</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {appliedDiscounts.length > 0
                        ? 'Scroll down to see applied offers'
                        : 'No offers applied to this order'}
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
              buyContext={{ quantity: line.quantity, productTitle: line.productTitle }}
              onChooseItemsClick={() => setBxgyChooseItemsModalOpen(true)}
            />

            <div className="px-6 pb-4">
              <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-normal text-gray-900">Deliver to {user?.firstName || ''}</h3>
                  </div>
                  <p className="text-sm font-normal text-gray-600 whitespace-pre-wrap">
                    {addresses.find((a) => a._id === selectedShippingAddressId)?.address ||
                      'Select a shipping address'}
                  </p>
                  {user?.email && <p className="text-sm font-normal text-gray-500 mt-1">{user.email}</p>}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-normal text-gray-700">Shipping Address</label>
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
                      <p className="text-sm font-normal text-gray-600 mb-3">No addresses found</p>
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
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${badge.bg} ${badge.color}`}>
                                {badge.text}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gray-800 truncate">{d.label}</p>
                            {d.description && (
                              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{d.description}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-semibold text-emerald-600">−{formatINR(d.amount)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Total Savings</span>
                    <span className="text-sm font-bold text-emerald-600">−{formatINR(totalDiscountAmount)}</span>
                  </div>
                </div>
              </div>
            )}

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
                          <span className="line-through text-gray-400">{formatINR(shippingCost)}</span>
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
                        <span className="font-medium text-emerald-600">−{formatINR(totalDiscountAmount)}</span>
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

          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <button
              type="button"
              onClick={goToCheckoutPayment}
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

      {(bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount) &&
        (bxgyDiscountCodeResult ?? bxgyAppliedAutomaticDiscount)?.customerGetsAnyItemsFrom ===
          'specific-collections' &&
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

      {addAddressModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={newAddress.company}
                  onChange={(e) => setNewAddress({ ...newAddress, company: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                  placeholder="Company name"
                />
              </div>

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
                disabled={
                  addressLoading ||
                  !newAddress.firstName ||
                  !newAddress.lastName ||
                  !newAddress.address ||
                  !newAddress.city ||
                  !newAddress.state ||
                  !newAddress.countryId ||
                  !newAddress.pinCode ||
                  !newAddress.phoneNumber
                }
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addressLoading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickBuyNowCheckoutModal;
