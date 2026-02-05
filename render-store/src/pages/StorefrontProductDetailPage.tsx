import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiTruck, FiMapPin, FiTag, FiShare2, FiHeart } from 'react-icons/fi';
import { FaStar, FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import StorefrontNavbar from '../components/StorefrontNavbar';
import AuthPopup from '../components/AuthPopup';

const NAVBAR_HEIGHT = 64;

const StorefrontProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { variants, loading: variantsLoading, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry, items, getCartByCustomerId } = useStorefrontCart();
  const { user, checkAuth } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [authPopupOpen, setAuthPopupOpen] = useState<boolean>(false);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState<boolean>(false);
  const { addresses } = useCustomerAddresses();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');

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

  const product = useMemo(() => products.find(p => p._id === id), [products, id]);

  useEffect(() => {
    if (product?._id) {
      fetchVariantsByProductId(product._id);
    }
  }, [product?._id]);

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
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    try {
      await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 });
    } catch {}
  };

  const handleBuyNow = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    try {
      await createCartEntry({ storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 });
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
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-3 right-3 bg-white/95 hover:bg-white rounded-lg p-2 z-10 transition-colors shadow-sm"
              >
                <FiHeart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-[#0c100c]'}`} />
              </button>
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
                  ${(product.price / 100).toFixed(2)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-[#2b1e1e]/60 line-through">
                    ${(product.compareAtPrice / 100).toFixed(2)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold">
                    Save {discountPercentage}%
                  </span>
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
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-lg transition-colors ${
                    isWishlisted ? 'text-red-500 hover:bg-red-50' : 'text-[#2b1e1e] hover:bg-[#f5f1e8]'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
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
                      <p className="text-xs text-[#2b1e1e] mt-0.5">On orders over $50</p>
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
          <div className="bg-[#fefcf8] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d5]">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuickCheckoutOpen(false)} className="p-1 hover:bg-[#f5f1e8] rounded-lg transition-colors">
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
                        <span className="inline-block px-2 py-1 rounded-md bg-[#d4af37]/10 text-[#d4af37] text-xs mt-1">
                          ${((product.compareAtPrice || product.price) > product.price ? ((product.compareAtPrice! - product.price)/100).toFixed(2) : '0.00')} saved so far
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#2b1e1e]">1 item</p>
                      <div className="flex items-center gap-2">
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-[#2b1e1e]/60 line-through">
                            ${(product.compareAtPrice/100).toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#d4af37]">${(product.price/100).toFixed(2)}</span>
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
                    <select
                      value={selectedShippingAddressId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedShippingAddressId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none bg-white text-[#0c100c]"
                    >
                      {addresses.map((a) => (
                        <option key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.city}</option>
                      ))}
                    </select>
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
                    You saved $0.00
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
                onClick={() => setQuickCheckoutOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedShippingAddressId || orderLoading}
                className="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
              >
                {orderLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontProductDetailPage;
