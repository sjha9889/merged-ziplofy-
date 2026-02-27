import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiShare2, FiCopy } from 'react-icons/fi';
import { FaStar, FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import { useProductOffers } from '../contexts/product-offers.context';
import StorefrontNavbar from '../components/StorefrontNavbar';
import AuthPopup from '../components/AuthPopup';
import { formatINR } from '../utils/currency';

const NAVBAR_HEIGHT = 64;

const StorefrontProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    productDetail,
    productDetailLoading,
    productDetailError,
    fetchProductById,
    clearProductDetail,
  } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { variants, loading: variantsLoading, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry, items, getCartByCustomerId } = useStorefrontCart();
  const { user, checkAuth } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [authPopupOpen, setAuthPopupOpen] = useState<boolean>(false);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState<boolean>(false);
  const { addresses } = useCustomerAddresses();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const {
    freeShippingOffers,
    amountOffOrderOffers,
    amountOffProductsOffers,
    buyXGetYOffers,
    loading: offersLoading,
    fetchFreeShippingOffersForProduct,
    fetchAmountOffOrderOffersForProduct,
    fetchAmountOffProductsOffersForProduct,
    fetchBuyXGetYOffersForProduct,
  } = useProductOffers();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id]);


  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => clearProductDetail();
  }, [id, fetchProductById, clearProductDetail]);

  // Fetch active offers for this product (and customer, if logged in)
  useEffect(() => {
    if (id) {
      fetchFreeShippingOffersForProduct(id, user?._id || null);
    }
  }, [id, user?._id, fetchFreeShippingOffersForProduct]);

  useEffect(() => {
    if (id) {
      fetchAmountOffOrderOffersForProduct(id, user?._id || null);
    }
  }, [id, user?._id, fetchAmountOffOrderOffersForProduct]);

  useEffect(() => {
    if (id) {
      fetchAmountOffProductsOffersForProduct(id, user?._id || null);
    }
  }, [id, user?._id, fetchAmountOffProductsOffersForProduct]);

  useEffect(() => {
    if (id) {
      fetchBuyXGetYOffersForProduct(id, user?._id || null);
    }
  }, [id, user?._id, fetchBuyXGetYOffersForProduct]);

  const product = useMemo(
    () => productDetail ?? products.find(p => p._id === id),
    [productDetail, products, id]
  );

  useEffect(() => {
    if (id) {
      fetchVariantsByProductId(id);
    }
  }, [id, fetchVariantsByProductId]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstReal = variants.find(v => !v.isSynthetic) || variants[0];
      setSelectedVariantId(firstReal._id);
      const initOpts: Record<string, string> = {};
      const ov = (firstReal.optionValues || {}) as Record<string, string>;
      Object.keys(ov).forEach(k => { initOpts[k] = ov[k]; });
      setSelectedOptions(initOpts);
    } else {
      setSelectedVariantId(null);
      setSelectedOptions({});
    }
  }, [variants]);

  const optionAxes = useMemo(() => {
    const axes = new Map<string, Set<string>>();
    for (const v of variants) {
      const ov = (v.optionValues || {}) as Record<string, string>;
      for (const [k, val] of Object.entries(ov)) {
        if (!axes.has(k)) axes.set(k, new Set());
        axes.get(k)!.add(String(val));
      }
    }
    return Array.from(axes.entries()).map(([name, set]) => ({ name, values: Array.from(set) }));
  }, [variants]);

  const handleSelectOption = (optionName: string, value: string) => {
    const next = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(next);
    const match = variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => !ov[k] || String(ov[k]) === String(val));
    }) || variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => String(ov[k]) === String(val));
    });
    if (match) setSelectedVariantId(match._id);
  };

  const handleAddToCart = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;
    try {
      const selectedVariant = displayVariants.find(v => v._id === selectedVariantId);
      await createCartEntry(
        { storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 },
        selectedVariant // Pass variant for guest cart
      );
      // After a successful add, open the global cart drawer via a custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('open-cart-drawer'));
      }
    } catch {}
  };

  const handleBuyNow = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;
    // Buy Now requires login for checkout
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    try {
      const selectedVariant = displayVariants.find(v => v._id === selectedVariantId);
      await createCartEntry(
        { storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 },
        selectedVariant // Pass variant for guest cart
      );
      if (user.defaultAddress) setSelectedShippingAddressId(user.defaultAddress);
      else if (addresses.length > 0) setSelectedShippingAddressId(addresses[0]._id);
      setQuickCheckoutOpen(true);
    } catch {}
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddressId || !user?._id || !storeFrontMeta?.storeId) return;
    try {
      const orderItems = items.map((item) => {
        const pv = typeof item.productVariantId === 'object' ? item.productVariantId : null;
        const price = pv?.price ?? 0;
        return {
          productVariantId: typeof item.productVariantId === 'object' ? item.productVariantId._id : item.productVariantId,
          quantity: item.quantity,
          price,
          total: price * item.quantity,
        };
      });
      await createOrder({
        storeId: storeFrontMeta.storeId,
        shippingAddressId: selectedShippingAddressId,
        items: orderItems,
        paymentMethod: 'cod',
        subtotal: orderItems.reduce((s, it) => s + it.total, 0),
        tax: 0,
        shippingCost: 0,
        total: orderItems.reduce((s, it) => s + it.total, 0),
      } as any);
      setQuickCheckoutOpen(false);
    } catch (e) {}
  };

  if (productDetailLoading && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />
        <div className="flex justify-center items-center" style={{ paddingTop: `${NAVBAR_HEIGHT + 120}px`, paddingBottom: '24px' }}>
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (productDetailError && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />
        <div className="max-w-3xl mx-auto px-4" style={{ paddingTop: `${NAVBAR_HEIGHT + 32}px`, paddingBottom: '24px' }}>
          <h2 className="text-lg text-red-600 text-center">{productDetailError}</h2>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-[#e8e0d5] hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />
        <div className="max-w-3xl mx-auto px-4" style={{ paddingTop: `${NAVBAR_HEIGHT + 32}px`, paddingBottom: '24px' }}>
          <h2 className="text-lg text-[#2b1e1e] text-center">Product not found</h2>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-[#e8e0d5] hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
              Go back
            </button>
          </div>
        </div>
        <footer className="border-t border-[#e8e0d5] py-6 bg-[#fefcf8] mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#2b1e1e]">© {new Date().getFullYear()} {storeFrontMeta?.name || ''}. All rights reserved.</p>
              <div className="flex gap-4">
                <button type="button" className="text-sm text-[#2b1e1e] hover:text-[#d4af37] transition-colors">Privacy</button>
                <button type="button" className="text-sm text-[#2b1e1e] hover:text-[#d4af37] transition-colors">Terms</button>
                <button type="button" className="text-sm text-[#2b1e1e] hover:text-[#d4af37] transition-colors">Contact</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/800x600?text=Product'];
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
      <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${NAVBAR_HEIGHT + 24}px` }}>
        <nav className={`mb-8 transition-opacity duration-400 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 text-xs text-[#2b1e1e]">
            <button type="button" onClick={() => navigate('/')} className="hover:text-[#d4af37] transition-colors">
              Home
            </button>
            <span>/</span>
            <button type="button" className="hover:text-[#d4af37] transition-colors">
              {product.category?.name || 'Category'}
            </button>
            <span>/</span>
            <span className="text-[#0c100c]">{product.title}</span>
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images */}
          <div className={`w-full lg:w-1/2 flex-shrink-0 transition-opacity duration-600 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="rounded-lg overflow-hidden border border-[#e8e0d5] relative bg-white">
              {discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-[#d4af37] text-[#0c100c] px-2.5 py-1 rounded-md text-xs font-bold z-10">
                  -{discountPercentage}%
                </div>
              )}
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-80 md:h-[500px] object-contain transition-all duration-300"
              />
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-t border-[#e8e0d5]">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-[#d4af37] opacity-100' : 'border-[#e8e0d5] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={`flex-1 transition-opacity duration-800 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-8 rounded-lg border border-[#e8e0d5] bg-white">
              <h1 className="text-3xl font-bold mb-2 text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                  ))}
                  <FaStar className="w-3.5 h-3.5 text-[#e8e0d5]" />
                </div>
                <span className="text-xs text-[#2b1e1e]">(4.5) • 128 reviews</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.vendor?.name && (
                  <span className="px-2.5 py-1 rounded-md bg-[#f5f1e8] text-[#0c100c] text-xs font-medium">
                    {product.vendor.name}
                  </span>
                )}
                {product.category?.name && (
                  <span className="px-2.5 py-1 rounded-md border border-[#e8e0d5] text-[#2b1e1e] text-xs font-medium">
                    {product.category.name}
                  </span>
                )}
                {product.status && (
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-[#f5f1e8] text-[#2b1e1e]'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#d4af37]">
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-[#2b1e1e]/60 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Active Offers (real data from product offers context) */}
              <div className="mb-6">
                <h3
                  className="text-base font-semibold mb-3 text-[#0c100c]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Active Offers
                </h3>

                {offersLoading ? (
                  <p className="text-xs text-[#2b1e1e]">Checking offers for this product…</p>
                ) : freeShippingOffers.length === 0 &&
                  amountOffOrderOffers.length === 0 &&
                  amountOffProductsOffers.length === 0 &&
                  buyXGetYOffers.length === 0 ? (
                  <p className="text-xs text-[#2b1e1e]/70">No active offers right now.</p>
                ) : (
                  <div className="space-y-3">
                    {freeShippingOffers.length > 0 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {freeShippingOffers.map((offer, index) => {
                      const palette =
                        index === 0
                          ? { from: '#e9fff7', to: '#d3f4ea', border: '#b4e2d0', accent: '#0f766e' }
                          : index === 1
                          ? { from: '#e9f3ff', to: '#d3e4ff', border: '#b4c8f0', accent: '#1d4ed8' }
                          : { from: '#fff3e6', to: '#ffe4cc', border: '#f6c999', accent: '#b45309' };

                      const badgeLabel =
                        index === 0 ? 'MOST POPULAR' : index === 1 ? 'BEST VALUE' : 'MOST SAVINGS';

                      const hasCode = !!offer.discountCode;

                      return (
                        <div
                          key={offer.id}
                          className={`flex-1 rounded-2xl bg-gradient-to-b from-[${palette.from}] to-[${palette.to}] border px-4 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}
                          style={{ borderColor: palette.border }}
                        >
                          <div className="inline-flex px-3 py-1 rounded-full bg-[#0f172a] text-[10px] font-semibold text-white mb-3">
                            {badgeLabel}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-[#0c100c]">
                            {offer.minimumPurchase === 'minimum-amount' && offer.minimumAmount
                              ? `Free shipping on orders over ${formatINR(offer.minimumAmount)}`
                              : offer.minimumPurchase === 'minimum-quantity' && offer.minimumQuantity
                              ? `Free shipping when you buy ${offer.minimumQuantity}+ item(s)`
                              : 'Free shipping offer'}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-[#d4af37]/40 text-[10px] font-semibold text-[#0c100c]">
                              Free shipping
                            </span>
                          </div>
                          {offer.minimumRequirementMessage && (
                            <p className="text-xs font-medium mb-2" style={{ color: palette.accent }}>
                              {offer.minimumRequirementMessage}
                            </p>
                          )}
                          {offer.endsInText && (
                            <p className="text-[11px] text-[#6b5b3a] mb-2">{offer.endsInText}</p>
                          )}
                          {hasCode ? (
                            <p className="text-xs font-semibold text-[#0c100c] flex items-center gap-1">
                              Code:{' '}
                              <span className="font-mono tracking-wide">
                                {offer.discountCode}
                              </span>
                              <FiCopy className="w-3 h-3 text-[#0c100c]/70" />
                            </p>
                          ) : (
                            <p className="text-xs font-medium text-[#2b1e1e]">
                              Applied automatically at checkout.
                            </p>
                          )}
                        </div>
                      );
                    })}
                      </div>
                    )}

                    {amountOffOrderOffers.length > 0 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {amountOffOrderOffers.map((offer, index) => {
                          const palette =
                            index === 0
                              ? { from: '#eef2ff', to: '#e0e7ff', border: '#c7d2fe', accent: '#4f46e5' }
                              : index === 1
                              ? { from: '#ecfdf3', to: '#dcfce7', border: '#bbf7d0', accent: '#16a34a' }
                              : { from: '#fef3c7', to: '#ffedd5', border: '#fed7aa', accent: '#b45309' };

                          const badgeLabel =
                            index === 0 ? 'ORDER DISCOUNT' : index === 1 ? 'MORE SAVINGS' : 'LIMITED OFFER';

                          const hasCode = !!offer.discountCode;

                          return (
                            <div
                              key={offer.id}
                              className={`flex-1 rounded-2xl bg-gradient-to-b from-[${palette.from}] to-[${palette.to}] border px-4 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}
                              style={{ borderColor: palette.border }}
                            >
                              <div className="inline-flex px-3 py-1 rounded-full bg-[#0f172a] text-[10px] font-semibold text-white mb-3">
                                {badgeLabel}
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-[#0c100c]">
                                  {offer.valueDescription}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-[#0f172a]/20 text-[10px] font-semibold text-[#0c100c]">
                                  Order discount
                                </span>
                              </div>
                              {offer.minimumRequirementMessage && (
                                <p className="text-xs font-medium mb-2" style={{ color: palette.accent }}>
                                  {offer.minimumRequirementMessage}
                                </p>
                              )}
                              {offer.endsInText && (
                                <p className="text-[11px] text-[#6b5b3a] mb-2">{offer.endsInText}</p>
                              )}
                              {hasCode ? (
                                <p className="text-xs font-semibold text-[#0c100c] flex items-center gap-1">
                                  Code:{' '}
                                  <span className="font-mono tracking-wide">
                                    {offer.discountCode}
                                  </span>
                                  <FiCopy className="w-3 h-3 text-[#0c100c]/70" />
                                </p>
                              ) : (
                                <p className="text-xs font-medium text-[#2b1e1e]">
                                  Applied automatically at checkout.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {amountOffProductsOffers.length > 0 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {amountOffProductsOffers.map((offer, index) => {
                          const palette =
                            index === 0
                              ? { from: '#fef2f2', to: '#fee2e2', border: '#fecaca', accent: '#b91c1c' }
                              : index === 1
                              ? { from: '#eff6ff', to: '#dbeafe', border: '#bfdbfe', accent: '#1d4ed8' }
                              : { from: '#ecfdf5', to: '#d1fae5', border: '#a7f3d0', accent: '#047857' };

                          const badgeLabel =
                            index === 0 ? 'PRODUCT DISCOUNT' : index === 1 ? 'SMART SAVINGS' : 'SPECIAL OFFER';

                          const hasCode = !!offer.discountCode;

                          const appliesLabel =
                            offer.appliesTo === 'specific-collections'
                              ? 'On selected collections'
                              : 'On selected products';

                          return (
                            <div
                              key={offer.id}
                              className={`flex-1 rounded-2xl bg-gradient-to-b from-[${palette.from}] to-[${palette.to}] border px-4 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}
                              style={{ borderColor: palette.border }}
                            >
                              <div className="inline-flex px-3 py-1 rounded-full bg-[#0f172a] text-[10px] font-semibold text-white mb-3">
                                {badgeLabel}
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-[#0c100c]">
                                  {offer.valueDescription}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-[#0f172a]/20 text-[10px] font-semibold text-[#0c100c]">
                                  Product discount
                                </span>
                              </div>
                              <p className="text-[11px] text-[#2b1e1e]/70 mb-1">{appliesLabel}</p>
                              {offer.minimumRequirementMessage && (
                                <p className="text-xs font-medium mb-2" style={{ color: palette.accent }}>
                                  {offer.minimumRequirementMessage}
                                </p>
                              )}
                              {offer.endsInText && (
                                <p className="text-[11px] text-[#6b5b3a] mb-2">{offer.endsInText}</p>
                              )}
                              {hasCode ? (
                                <p className="text-xs font-semibold text-[#0c100c] flex items-center gap-1">
                                  Code:{' '}
                                  <span className="font-mono tracking-wide">
                                    {offer.discountCode}
                                  </span>
                                  <FiCopy className="w-3 h-3 text-[#0c100c]/70" />
                                </p>
                              ) : (
                                <p className="text-xs font-medium text-[#2b1e1e]">
                                  Applied automatically at checkout.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {buyXGetYOffers.length > 0 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {buyXGetYOffers.map((offer, index) => {
                          const palette =
                            index === 0
                              ? { from: '#f0f9ff', to: '#e0f2fe', border: '#bae6fd', accent: '#0369a1' }
                              : index === 1
                              ? { from: '#fef3c7', to: '#ffedd5', border: '#fed7aa', accent: '#b45309' }
                              : { from: '#ecfdf5', to: '#d1fae5', border: '#a7f3d0', accent: '#047857' };

                          const badgeLabel =
                            index === 0 ? 'BUY X GET Y' : index === 1 ? 'MULTI-BUY OFFER' : 'COMBO DEAL';

                          const hasCode = !!offer.discountCode;

                          return (
                            <div
                              key={offer.id}
                              className={`flex-1 rounded-2xl bg-gradient-to-b from-[${palette.from}] to-[${palette.to}] border px-4 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.04)]`}
                              style={{ borderColor: palette.border }}
                            >
                              <div className="inline-flex px-3 py-1 rounded-full bg-[#0f172a] text-[10px] font-semibold text-white mb-3">
                                {badgeLabel}
                              </div>
                              <div className="flex flex-col gap-1 mb-2">
                                {offer.buysRequirementMessage && (
                                  <p className="text-sm font-semibold text-[#0c100c]">
                                    {offer.buysRequirementMessage}
                                  </p>
                                )}
                                <p className="text-xs font-medium text-[#2b1e1e]">
                                  {offer.getsMessage}
                                </p>
                              </div>
                              {offer.endsInText && (
                                <p className="text-[11px] text-[#6b5b3a] mb-2">{offer.endsInText}</p>
                              )}
                              {hasCode ? (
                                <p className="text-xs font-semibold text-[#0c100c] flex items-center gap-1">
                                  Code:{' '}
                                  <span className="font-mono tracking-wide">
                                    {offer.discountCode}
                                  </span>
                                  <FiCopy className="w-3 h-3 text-[#0c100c]/70" />
                                </p>
                              ) : (
                                <p className="text-xs font-medium text-[#2b1e1e]">
                                  Applied automatically at checkout.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Variants Selection */}
              {!variantsLoading && (
                variants.length === 1 && variants[0]?.isSynthetic ? (
                  <p className="text-sm text-[#2b1e1e] mb-6">This product has no variants.</p>
                ) : (
                  <div className="mb-6">
                    {optionAxes.map(axis => (
                      <div key={axis.name} className="mb-4">
                        <h3 className="text-sm font-semibold mb-2.5 text-[#0c100c]">{axis.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {axis.values.map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleSelectOption(axis.name, val)}
                              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                                selectedOptions[axis.name] === val
                                  ? 'bg-[#d4af37] text-[#0c100c] hover:bg-[#e6c547]'
                                  : 'border border-[#e8e0d5] text-[#2b1e1e] hover:bg-[#f5f1e8]'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              <p className="text-sm text-[#2b1e1e] mb-8 leading-relaxed">{product.description}</p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] text-sm font-semibold hover:shadow-lg transition-all"
                  style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 rounded-lg border border-[#0c100c] text-[#0c100c] text-sm font-semibold hover:bg-[#0c100c] hover:text-[#fefcf8] transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <div className="flex gap-3 mb-6">
                <button type="button" className="p-2 text-[#2b1e1e] hover:bg-[#f5f1e8] rounded-lg transition-colors">
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>

              <hr className="my-6 border-[#e8e0d5]" />

              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4 text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>Why Choose This Product?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f5f1e8] flex items-center justify-center flex-shrink-0">
                      <FaShippingFast className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0c100c]">Free Shipping</h4>
                      <p className="text-xs text-[#2b1e1e] mt-0.5">On orders over ₹500</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f5f1e8] flex items-center justify-center flex-shrink-0">
                      <FaShieldAlt className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0c100c]">Secure Payment</h4>
                      <p className="text-xs text-[#2b1e1e] mt-0.5">Your data is protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f5f1e8] flex items-center justify-center flex-shrink-0">
                      <FaHeadset className="w-4 h-4 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#0c100c]">24/7 Support</h4>
                      <p className="text-xs text-[#2b1e1e] mt-0.5">We're here to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#e8e0d5] py-8 bg-[#fefcf8] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#2b1e1e]">
              © {new Date().getFullYear()} {storeFrontMeta?.name || ''}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <button type="button" className="text-xs text-[#2b1e1e] hover:text-[#d4af37] font-medium transition-colors">Privacy</button>
              <button type="button" className="text-xs text-[#2b1e1e] hover:text-[#d4af37] font-medium transition-colors">Terms</button>
              <button type="button" className="text-xs text-[#2b1e1e] hover:text-[#d4af37] font-medium transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
      
      <AuthPopup open={authPopupOpen} onClose={() => setAuthPopupOpen(false)} />

      {/* Quick Checkout Popup (Buy Now) */}
      {quickCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setQuickCheckoutOpen(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[95vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Top savings & items bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#0b1220] text-white text-xs sm:text-sm">
              <div className="font-semibold">
                {formatINR(
                  product.compareAtPrice && product.compareAtPrice > product.price
                    ? product.compareAtPrice - product.price
                    : 0
                )}{' '}
                saved so far
              </div>
              <div className="flex items-center gap-2">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="line-through opacity-80 text-[11px] sm:text-xs">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
                <span className="font-semibold text-sm sm:text-base">{formatINR(product.price)}</span>
                <span className="text-[11px] sm:text-xs opacity-80">1 item</span>
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuickCheckoutOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-[#0c100c]" />
                </button>
                <h2 className="text-lg font-semibold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {storeFrontMeta?.name || 'Store'}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>100% Secured Payment</span>
                <FiLock className="w-4 h-4 text-gray-700" />
              </div>
            </div>
            <div className="p-0 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 110px)' }}>
              {/* Offers & Rewards (top coupon area) */}
              <div className="px-6 pt-4 pb-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 overflow-hidden">
                  <div className="p-4">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                        className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">8 coupons available</span>
                      <button type="button" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login / phone entry section */}
              <div className="px-6 pb-4">
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-amber-100 text-amber-900 text-xs font-medium px-4 py-2">
                    Login to redeem rewards or giftcard balance
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Login to continue</p>
                      <p className="text-xs text-gray-600 mb-3">Enter mobile number to receive order updates.</p>
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
                      <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Powered by Ziplofy</p>
                      <div className="flex items-center justify-center gap-6 text-[10px] text-gray-500">
                        <span>PCI DSS Certified</span>
                        <span>100% Secured Payments</span>
                        <span>Verified Merchant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updates opt-in */}
              <div className="px-6 pb-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Send me order updates &amp; offers - (no spam)</span>
                </label>
              </div>
            </div>

            {/* Bottom primary action */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="w-full px-6 py-3 text-sm rounded-full bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {orderLoading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontProductDetailPage;
