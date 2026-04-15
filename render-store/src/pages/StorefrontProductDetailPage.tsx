import React, { useMemo, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiGift } from 'react-icons/fi';
import { FaShippingFast } from 'react-icons/fa';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useProductOffers } from '../contexts/product-offers.context';
import AuthPopup from '../components/AuthPopup';
import { QuickBuyNowCheckoutModal, type BuyNowCheckoutLine } from '../components/QuickBuyNowCheckoutModal';
import { formatINR } from '../utils/currency';
import {
  amountOffOrderSecondaryLine,
  amountOffProductSecondaryLine,
  buyXGetYSecondaryLine,
  dedupeAmountOffOrder,
  dedupeAmountOffProducts,
  dedupeBuyXGetY,
  dedupeFreeShipping,
  freeShippingSecondaryLine,
} from '../utils/product-offer-display';

function useRelatedSwiperInit() {
  useEffect(() => {
    const anyWindow = window as unknown as { Swiper?: new (sel: string, opts: unknown) => unknown };
    if (!anyWindow.Swiper) return;
    const root = document.querySelector('.related-swiper');
    if (!root || (root as unknown as { __relatedSwiper?: unknown }).__relatedSwiper) return;
    try {
      (root as unknown as { __relatedSwiper?: unknown }).__relatedSwiper = new anyWindow.Swiper('.related-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: { nextEl: '.related-next', prevEl: '.related-prev' },
        breakpoints: { 480: { slidesPerView: 2 }, 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 6 } },
      });
    } catch {
      /* ignore */
    }
  }, []);
}

const StorefrontProductDetailPage: React.FC = () => {
  useRelatedSwiperInit();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    productDetail,
    productDetailLoading,
    productDetailError,
    fetchProductById,
    fetchProductsByStoreId,
    clearProductDetail,
  } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { variants, loading: variantsLoading, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry, getCartByCustomerId } = useStorefrontCart();
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [buyNowLine, setBuyNowLine] = useState<BuyNowCheckoutLine | null>(null);
  const { user, checkAuth } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [authPopupOpen, setAuthPopupOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);

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
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id, getCartByCustomerId]);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => clearProductDetail();
  }, [id, fetchProductById, clearProductDetail]);

  useEffect(() => {
    if (storeFrontMeta?.storeId && products.length === 0) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 }).catch(() => {});
    }
  }, [storeFrontMeta?.storeId, products.length, fetchProductsByStoreId]);

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
      const selectedVariant = variants.find(v => v._id === selectedVariantId);
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

  const handleBuyNow = () => {
    if (!selectedVariantId || !product) return;
    const selectedVariant = variants.find((v) => v._id === selectedVariantId);
    if (!selectedVariant) return;
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    setBuyNowLine({
      variant: selectedVariant,
      quantity,
      productTitle: product.title,
      productImage: product.imageUrls?.[0] ?? selectedVariant.images?.[0],
    });
    setBuyNowModalOpen(true);
  };

  const selectedVariantForPrice = useMemo(
    () => variants.find((v) => v._id === selectedVariantId),
    [variants, selectedVariantId]
  );
  const lineSubtotalForOffers = useMemo(() => {
    const unit = selectedVariantForPrice?.price ?? product?.price ?? 0;
    return unit * quantity;
  }, [selectedVariantForPrice, product, quantity]);

  const displayFreeShipping = useMemo(() => dedupeFreeShipping(freeShippingOffers).slice(0, 3), [freeShippingOffers]);
  const displayAmountOffOrder = useMemo(
    () => dedupeAmountOffOrder(amountOffOrderOffers).slice(0, 3),
    [amountOffOrderOffers]
  );
  const displayAmountOffProducts = useMemo(
    () => dedupeAmountOffProducts(amountOffProductsOffers).slice(0, 3),
    [amountOffProductsOffers]
  );
  const displayBuyXGetY = useMemo(() => dedupeBuyXGetY(buyXGetYOffers).slice(0, 3), [buyXGetYOffers]);

  if (productDetailLoading && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <div className="flex justify-center items-center py-32">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (productDetailError && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
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
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
          <h2 className="text-lg text-[#2b1e1e] text-center">Product not found</h2>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-[#e8e0d5] hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/800x600?text=Product'];
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <main className="product-section">
        <div className="product-section__inner">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="product-breadcrumb__sep" />
            <Link to="/category">{product.category?.name || 'Products'}</Link>
            <span className="product-breadcrumb__sep" />
            <span className="product-breadcrumb__current">{product.title}</span>
          </nav>

          <div className="product-grid">
            <div className="product-gallery-wrap">
              <div className="product-gallery">
                {images.length > 1 && (
                  <div className="product-gallery__thumbs">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`product-gallery__thumb ${currentImageIndex === index ? 'active' : ''}`}
                        data-index={String(index)}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="product-gallery__main-wrap">
                  <div className="product-gallery__main">
                    <img id="product-main-img" src={images[currentImageIndex]} alt={product.title} />
                  </div>
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="product-gallery__nav product-gallery__nav--prev"
                        onClick={() => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="product-gallery__nav product-gallery__nav--next"
                        onClick={() => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="product-info-card">
              <div className="product-info">
                {(discountPercentage > 0 || product.vendor?.name) && (
                  <div className="product-info__tags">
                    {discountPercentage > 0 && (
                      <span className="product-info__tag product-info__tag--sale">{discountPercentage}% OFF</span>
                    )}
                    {product.vendor?.name && (
                      <span className="product-info__tag product-info__tag--new">{product.vendor.name}</span>
                    )}
                  </div>
                )}

                <div className="product-info__title-row">
                  <h1 className="product-info__title">{product.title}</h1>
                  <button type="button" className="product-info__wishlist" aria-label="Wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="product-info__rating">
                  <div className="product-info__stars" />
                  <span className="product-info__reviews">(0 verified reviews)</span>
                </div>

                <div className="product-info__price-row">
                  <span className="product-info__price">{formatINR(product.price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <>
                      <span className="product-info__price-old">{formatINR(product.compareAtPrice)}</span>
                      {discountPercentage > 0 && (
                        <span className="product-info__discount">{discountPercentage}% OFF</span>
                      )}
                    </>
                  )}
                </div>

                {/* Available Offers */}
                {!offersLoading &&
                  (displayFreeShipping.length > 0 ||
                    displayAmountOffOrder.length > 0 ||
                    displayAmountOffProducts.length > 0 ||
                    displayBuyXGetY.length > 0) && (
                    <div className="mb-6 space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Available Offers</p>
                      <p className="text-[11px] text-gray-500">
                        Shown for qty <strong>{quantity}</strong> of this item (cart checkout recalculates with your full cart).
                      </p>
                      <div className="space-y-2">
                        {displayFreeShipping.map((offer) => (
                          <div
                            key={offer.id}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <FaShippingFast className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">Free Shipping</p>
                              <p className="text-xs text-gray-500">
                                {freeShippingSecondaryLine(offer, quantity, lineSubtotalForOffers)}
                              </p>
                            </div>
                            {offer.discountCode && (
                              <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                                {offer.discountCode}
                              </code>
                            )}
                          </div>
                        ))}
                        {displayAmountOffOrder.map((offer) => (
                          <div
                            key={offer.id}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-blue-600">%</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">{offer.valueDescription}</p>
                              <p className="text-xs text-gray-500">
                                {amountOffOrderSecondaryLine(offer, quantity, lineSubtotalForOffers)}
                              </p>
                            </div>
                            {offer.discountCode && (
                              <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                                {offer.discountCode}
                              </code>
                            )}
                          </div>
                        ))}
                        {displayAmountOffProducts.map((offer) => (
                          <div
                            key={offer.id}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-purple-600">%</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">{offer.valueDescription}</p>
                              <p className="text-xs text-gray-500">
                                {amountOffProductSecondaryLine(offer, quantity, lineSubtotalForOffers)}
                              </p>
                            </div>
                            {offer.discountCode && (
                              <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                                {offer.discountCode}
                              </code>
                            )}
                          </div>
                        ))}
                        {displayBuyXGetY.map((offer) => (
                          <div
                            key={offer.id}
                            className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <FiGift className="w-3.5 h-3.5 text-amber-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 font-medium">Buy X Get Y</p>
                              <p className="text-xs text-gray-500">
                                {buyXGetYSecondaryLine(offer, quantity, lineSubtotalForOffers)}
                              </p>
                            </div>
                            {offer.discountCode && (
                              <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                                {offer.discountCode}
                              </code>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Variants */}
                {!variantsLoading && !(variants.length === 1 && variants[0]?.isSynthetic) && optionAxes.length > 0 && (
                  <>
                    {optionAxes.map(axis => (
                      <div key={axis.name} className="product-info__option">
                        <span className="product-info__option-label">{axis.name}: {selectedOptions[axis.name] || 'Select'}</span>
                        <div className="product-info__sizes">
                          {axis.values.map(val => (
                            <button
                              key={val}
                              type="button"
                              className={`product-info__size ${selectedOptions[axis.name] === val ? 'active' : ''}`}
                              onClick={() => handleSelectOption(axis.name, val)}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <div className="product-info__option product-info__qty-section">
                  <div className="product-info__qty-row">
                    <span className="product-info__qty-label">Quantity:</span>
                    <div className="product-info__qty-wrap">
                      <button type="button" className="product-info__qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                      <input type="number" className="product-info__qty-input" value={quantity} min={1} max={10} readOnly />
                      <button type="button" className="product-info__qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button type="button" className="product-info__btn product-info__btn--buy" onClick={handleBuyNow}>Buy Now</button>
                  </div>
                  <button type="button" className="product-info__btn product-info__btn--cart" onClick={handleAddToCart}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>

                <div className="product-info__share-row">
                  <button type="button" className="product-info__share-link">Share</button>
                  <span className="product-info__share-sep">|</span>
                  <button type="button" className="product-info__share-link">Compare</button>
                </div>

                <div className="product-info__meta-block">
                  <p className="product-info__shipping">
                    <strong>Free Shipping Worldwide:</strong>
                    <br />
                    <span className="product-info__shipping-detail">Estimated Delivery 3-5 Business Days</span>
                  </p>
                  <p className="product-info__meta"><strong>SKU:</strong> {product._id}</p>
                  {product.vendor?.name && (
                    <p className="product-info__meta"><strong>Brand:</strong> {product.vendor.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="benefits-section">
        <div className="benefits-inner">
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1h-1m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <h3 className="benefits-title">Free Shipping</h3>
            <p className="benefits-desc">Enjoy the Convenience of Free Shipping on Every Order</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="benefits-title">24x7 Support</h3>
            <p className="benefits-desc">Round-the-Clock Assistance, Anytime You Need It</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="benefits-title">30 Days Return</h3>
            <p className="benefits-desc">Your Satisfaction is Our Priority: Return Any Product Within 30 Days</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M15 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm0 5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
              </svg>
            </div>
            <h3 className="benefits-title">Secure Payment</h3>
            <p className="benefits-desc">Seamless Shopping Backed by Safe and Secure Payment Options</p>
          </div>
        </div>
      </section>

      <section className="product-desc-section">
        <div className="product-desc-container">
          <div className="product-desc-tabs">
            <button type="button" className="product-desc-tab active" data-tab="description">Description</button>
            <button type="button" className="product-desc-tab" data-tab="additional">Additional Info</button>
            <button type="button" className="product-desc-tab" data-tab="reviews">Reviews</button>
          </div>
          <div id="tab-description" className="product-desc-content active">
            <div className="product-desc-card">
              <h3 className="product-desc-title">Description</h3>
              <p className="product-desc-text">{product.description || 'No description available.'}</p>
            </div>
          </div>
          <div id="tab-additional" className="product-desc-content">
            <div className="product-desc-card product-desc-card--info">
              <h3 className="product-desc-info-title">Additional Info</h3>
              <dl className="product-desc-info-list">
                <div className="product-desc-info-row"><dt>Product ID</dt><dd>{product._id}</dd></div>
                {product.vendor?.name && <div className="product-desc-info-row"><dt>Brand</dt><dd>{product.vendor.name}</dd></div>}
              </dl>
            </div>
          </div>
          <div id="tab-reviews" className="product-desc-content">
            <div className="product-desc-card">
              <h3 className="product-desc-title">Reviews</h3>
              <p className="product-desc-text">No reviews yet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="related-products" aria-labelledby="related-products-heading">
        <div className="related-products-inner">
          <header className="related-products-header">
            <h2 id="related-products-heading" className="related-products-title">Related Products</h2>
            <div className="related-products-nav">
              <button type="button" className="related-prev" aria-label="Previous products">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" className="related-next" aria-label="Next products">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </header>
          <div className="swiper related-swiper">
            <div className="swiper-wrapper">
              {products.filter(p => p._id !== product._id).slice(0, 12).map((rel) => {
                const relImg = (rel.imageUrls && rel.imageUrls[0]) || '/assets/img/watch-1.jpg';
                const relDiscount = rel.compareAtPrice && rel.compareAtPrice > rel.price
                  ? Math.round(((rel.compareAtPrice - rel.price) / rel.compareAtPrice) * 100)
                  : 0;
                return (
                  <article key={rel._id} className="swiper-slide related-card-slide">
                    <div className="related-card">
                      <Link to={`/products/${rel._id}`} className="related-card-link">
                        <div className="related-card-image-wrap">
                          <img src={relImg} alt={rel.title} className="related-card-image" />
                        </div>
                        <h3 className="related-card-title">{rel.title}</h3>
                      </Link>
                      <div className="related-card-rating">
                        <span className="related-card-stars">★★★★☆</span>
                        <span className="related-card-reviews">(0)</span>
                      </div>
                      <div className="related-card-price-row">
                        <span className="related-card-price">{formatINR(rel.price)}</span>
                        {rel.compareAtPrice && rel.compareAtPrice > rel.price && (
                          <>
                            <span className="related-card-price-old">{formatINR(rel.compareAtPrice)}</span>
                            {relDiscount > 0 && <span className="related-card-discount">{relDiscount}% OFF</span>}
                          </>
                        )}
                      </div>
                      <div className="related-card-actions">
                        <button type="button" className="related-card-wishlist" aria-label="Add to wishlist">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <Link to={`/products/${rel._id}`} className="related-card-addcart">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AuthPopup open={authPopupOpen} onClose={() => setAuthPopupOpen(false)} />
      <QuickBuyNowCheckoutModal
        open={buyNowModalOpen}
        onClose={() => {
          setBuyNowModalOpen(false);
          setBuyNowLine(null);
        }}
        line={buyNowLine}
      />

    </div>
  );
};

export default StorefrontProductDetailPage;
