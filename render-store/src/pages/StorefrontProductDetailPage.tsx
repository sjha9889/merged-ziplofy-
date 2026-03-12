import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiShare2, FiCopy, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { FaStar, FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontOrder } from '../contexts/storefront-order.context';
import { useProductOffers } from '../contexts/product-offers.context';
import { useStorefrontCountries } from '../contexts/storefront-country.context';
import StorefrontNavbar from '../components/StorefrontNavbar';
import AuthPopup from '../components/AuthPopup';
import { formatINR } from '../utils/currency';
import ziplofyLogo from '../assets/ziplofy-logo.png';

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
  const { createCartEntry, getCartByCustomerId } = useStorefrontCart();
  const { user, checkAuth, login, signup } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [authPopupOpen, setAuthPopupOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [quickCheckoutOpen, setQuickCheckoutOpen] = useState<boolean>(false);
  const { addresses, fetchCustomerAddressesByCustomerId, addCustomerAddress } = useCustomerAddresses();
  const { countries, getCountries } = useStorefrontCountries();
  const { createOrder, loading: orderLoading } = useStorefrontOrder();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
  
  // Add address form state
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    countryId: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
  });
  
  // Login/Signup form state for quick checkout
  const [checkoutAuthMode, setCheckoutAuthMode] = useState<'login' | 'signup'>('login');
  const [checkoutLoginForm, setCheckoutLoginForm] = useState({ email: '', password: '' });
  const [checkoutSignupForm, setCheckoutSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [checkoutLoginLoading, setCheckoutLoginLoading] = useState(false);
  const [checkoutSignupLoading, setCheckoutSignupLoading] = useState(false);
  const [checkoutLoginError, setCheckoutLoginError] = useState('');
  const [checkoutSignupError, setCheckoutSignupError] = useState('');
  
  // Buy Now item state - separate from cart
  const [buyNowItem, setBuyNowItem] = useState<{
    productId: string;
    variantId: string;
    quantity: number;
    product: {
      _id: string;
      title: string;
      price: number;
      compareAtPrice?: number;
      imageUrls?: string[];
    };
    variant: {
      _id: string;
      price: number;
      compareAtPrice?: number | null;
      optionValues: Record<string, string> | Record<string, never>;
      isSynthetic?: boolean;
    } | null;
  } | null>(null);

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
      fetchCustomerAddressesByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id, getCartByCustomerId, fetchCustomerAddressesByCustomerId]);

  // Fetch countries when add address form is shown
  useEffect(() => {
    if (showAddAddressForm && countries.length === 0) {
      getCountries({ limit: 300 }).catch(() => {});
    }
  }, [showAddAddressForm, countries.length, getCountries]);

  // Set default country (India) and user name when countries are loaded
  useEffect(() => {
    if (countries.length > 0 && !addressForm.countryId) {
      const india = countries.find((c) => c.iso2 === 'IN');
      setAddressForm((prev) => ({
        ...prev,
        countryId: india?._id || countries[0]._id,
        firstName: user?.firstName || prev.firstName,
        lastName: user?.lastName || prev.lastName,
      }));
    }
  }, [countries, addressForm.countryId, user?.firstName, user?.lastName]);

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

  const handleBuyNow = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId || !product) return;
    
    // Set buyNowItem state instead of adding to cart
    const selectedVariant = variants.find(v => v._id === selectedVariantId) || null;
    setBuyNowItem({
      productId: product._id,
      variantId: selectedVariantId,
      quantity: quantity,
      product: product,
      variant: selectedVariant,
    });
    
    // If user is logged in, pre-select address
    if (user) {
      if (user.defaultAddress) setSelectedShippingAddressId(user.defaultAddress);
      else if (addresses.length > 0) setSelectedShippingAddressId(addresses[0]._id);
    }
    
    // Reset auth form states
    setCheckoutAuthMode('login');
    setCheckoutLoginForm({ email: '', password: '' });
    setCheckoutSignupForm({ firstName: '', lastName: '', email: '', password: '' });
    setCheckoutLoginError('');
    setCheckoutSignupError('');
    setQuickCheckoutOpen(true);
  };
  
  const handleCheckoutLogin = async () => {
    if (!storeFrontMeta?.storeId || !checkoutLoginForm.email || !checkoutLoginForm.password) return;
    setCheckoutLoginLoading(true);
    setCheckoutLoginError('');
    try {
      const loggedInUser = await login({
        storeId: storeFrontMeta.storeId,
        email: checkoutLoginForm.email,
        password: checkoutLoginForm.password,
      });
      // After login, fetch addresses and select default
      if (loggedInUser.defaultAddress) {
        setSelectedShippingAddressId(loggedInUser.defaultAddress);
      }
      setCheckoutLoginForm({ email: '', password: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setCheckoutLoginError(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setCheckoutLoginLoading(false);
    }
  };
  
  const handleCheckoutSignup = async () => {
    if (!storeFrontMeta?.storeId || !checkoutSignupForm.email || !checkoutSignupForm.password || !checkoutSignupForm.firstName || !checkoutSignupForm.lastName) return;
    setCheckoutSignupLoading(true);
    setCheckoutSignupError('');
    try {
      await signup({
        storeId: storeFrontMeta.storeId,
        email: checkoutSignupForm.email,
        password: checkoutSignupForm.password,
        firstName: checkoutSignupForm.firstName,
        lastName: checkoutSignupForm.lastName,
      });
      setCheckoutSignupForm({ firstName: '', lastName: '', email: '', password: '' });
      setCheckoutAuthMode('login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setCheckoutSignupError(error?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setCheckoutSignupLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddressId || !user?._id || !storeFrontMeta?.storeId || !buyNowItem) return;
    try {
      // Use buyNowItem instead of cart items
      const price = buyNowItem.variant?.price ?? buyNowItem.product?.price ?? 0;
      const orderItems = [{
        productVariantId: buyNowItem.variantId,
        quantity: buyNowItem.quantity,
        price,
        total: price * buyNowItem.quantity,
      }];
      
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
      setBuyNowItem(null); // Clear buy now item after order
    } catch (e) {}
  };

  const handleSaveAddress = async () => {
    if (!user?._id || !addressForm.firstName || !addressForm.lastName || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.pinCode || !addressForm.phoneNumber || !addressForm.countryId) {
      return;
    }
    try {
      setAddingAddress(true);
      const newAddress = await addCustomerAddress({
        customerId: user._id,
        countryId: addressForm.countryId,
        firstName: addressForm.firstName,
        lastName: addressForm.lastName,
        address: addressForm.address,
        apartment: addressForm.apartment,
        city: addressForm.city,
        state: addressForm.state,
        pinCode: addressForm.pinCode,
        phoneNumber: addressForm.phoneNumber,
      });
      // Select the newly created address
      setSelectedShippingAddressId(newAddress._id);
      // Reset form and hide it
      setShowAddAddressForm(false);
      setAddressForm({
        countryId: countries.find((c) => c.iso2 === 'IN')?._id || countries[0]?._id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pinCode: '',
        phoneNumber: '',
      });
    } catch (e) {
      console.error('Failed to add address:', e);
    } finally {
      setAddingAddress(false);
    }
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
    <div className="min-h-screen bg-[#fafafa]">
      <StorefrontNavbar showBack showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Elegant Breadcrumbs */}
      <div className="bg-white border-b border-gray-100" style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <button type="button" onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-900 transition-colors">
                  Home
                </button>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <button type="button" className="text-gray-400 hover:text-gray-900 transition-colors">
                  {product.category?.name || 'Products'}
                </button>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium truncate max-w-[250px]">{product.title}</li>
            </ol>
          </motion.nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images - Left Side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-[52%] bg-gradient-to-br from-gray-50 to-white p-4 lg:p-6"
            >
              <div className="sticky top-28">
                {/* Main Image Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner">
                  {/* Sale Badge */}
                  {discountPercentage > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-5 left-5 z-10"
                    >
                      <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold tracking-wide">
                        SAVE {discountPercentage}%
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Main Image */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      src={images[currentImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-contain p-8"
                    />
                  </AnimatePresence>
                </div>
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-3 mt-6">
                    {images.map((img, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                          currentImageIndex === index 
                            ? 'ring-2 ring-black ring-offset-2 shadow-lg' 
                            : 'opacity-50 hover:opacity-100 border border-gray-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info - Right Side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex-1 p-4 lg:p-8"
            >
              {/* Brand */}
              {product.vendor?.name && (
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">
                  {product.vendor.name}
                </p>
              )}
              
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-light text-gray-900 leading-tight mb-4 tracking-tight">
                {product.title}
              </h1>
              
              {/* Rating Row */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FaStar key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">4.5 (128 reviews)</span>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
                    {formatINR(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xl text-gray-300 line-through font-light">
                      {formatINR(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="mt-2 text-sm text-emerald-600 font-medium">
                    Save {formatINR((product.compareAtPrice || 0) - product.price)} ({discountPercentage}% off)
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">Inclusive of all taxes</p>
              </div>

              {/* Available Offers - Elegant Design */}
              {!offersLoading && (freeShippingOffers.length > 0 || amountOffOrderOffers.length > 0 || amountOffProductsOffers.length > 0 || buyXGetYOffers.length > 0) && (
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Available Offers</p>
                  <div className="space-y-2">
                    {freeShippingOffers.slice(0, 2).map((offer) => (
                      <div key={offer.id} className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <FaShippingFast className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">Free Shipping</p>
                          <p className="text-xs text-gray-500">
                            {offer.minimumPurchase === 'minimum-amount' && offer.minimumAmount
                              ? `On orders above ${formatINR(offer.minimumAmount)}`
                              : 'On this order'}
                          </p>
                        </div>
                        {offer.discountCode && (
                          <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                            {offer.discountCode}
                          </code>
                        )}
                      </div>
                    ))}
                    {amountOffOrderOffers.slice(0, 2).map((offer) => (
                      <div key={offer.id} className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600">%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{offer.valueDescription}</p>
                          <p className="text-xs text-gray-500">{offer.minimumRequirementMessage || 'On this order'}</p>
                        </div>
                        {offer.discountCode && (
                          <code className="px-2.5 py-1 bg-white border border-dashed border-gray-300 rounded-md text-xs font-mono text-gray-600 group-hover:border-gray-400">
                            {offer.discountCode}
                          </code>
                        )}
                      </div>
                    ))}
                    {amountOffProductsOffers.slice(0, 2).map((offer) => (
                      <div key={offer.id} className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-purple-600">%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{offer.valueDescription}</p>
                          <p className="text-xs text-gray-500">On this product</p>
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

              {/* Variants Selection with Smooth Animation */}
              {!variantsLoading && !(variants.length === 1 && variants[0]?.isSynthetic) && (
                <div className="mb-6 pb-6 border-b border-gray-100">
                  {optionAxes.map(axis => (
                    <div key={axis.name} className="mb-5 last:mb-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        {axis.name}: <span className="text-gray-900">{selectedOptions[axis.name] || 'Select'}</span>
                      </p>
                      <div className="inline-flex flex-wrap gap-1 p-1 bg-gray-100 rounded-full">
                        {axis.values.map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleSelectOption(axis.name, val)}
                            className="relative px-5 py-2.5 text-sm font-medium rounded-full transition-colors duration-200"
                          >
                            {selectedOptions[axis.name] === val && (
                              <motion.div
                                layoutId={`variant-indicator-${axis.name}`}
                                className="absolute inset-0 bg-gray-900 rounded-full"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                              />
                            )}
                            <span className={`relative z-10 transition-colors duration-200 ${
                              selectedOptions[axis.name] === val ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}>
                              {val}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quantity</p>
                <div className="inline-flex items-center bg-gray-100 rounded-full">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-200"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900 text-lg">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-200"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button
                  type="button"
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-8 py-4 rounded-full bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition-all"
                >
                  BUY NOW
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-8 py-4 rounded-full bg-white text-gray-900 text-sm font-medium tracking-wide border-2 border-gray-900 hover:bg-gray-50 transition-all"
                >
                  ADD TO CART
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end py-4 border-t border-gray-100">
                <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  <FiShare2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">About This Product</h2>
              <div className="prose prose-sm prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
              </div>
            </div>

            {/* Why Shop With Us */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Why Shop With Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaShippingFast className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Express Shipping</p>
                    <p className="text-sm text-gray-500">On orders over ₹500</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-500">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaHeadset className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Premium Support</p>
                    <p className="text-sm text-gray-500">24/7 dedicated assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} {storeFrontMeta?.name || ''}. All rights reserved.</p>
            <div className="flex gap-8">
              <button type="button" className="hover:text-gray-900 transition-colors">Privacy</button>
              <button type="button" className="hover:text-gray-900 transition-colors">Terms</button>
              <button type="button" className="hover:text-gray-900 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
      
      <AuthPopup open={authPopupOpen} onClose={() => setAuthPopupOpen(false)} />

      {/* Quick Checkout Popup (Buy Now) */}
      <AnimatePresence>
        {quickCheckoutOpen && buyNowItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setQuickCheckoutOpen(false); setBuyNowItem(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            {(() => {
              // Calculate prices and discounts
              const itemPrice = buyNowItem.variant?.price ?? buyNowItem.product?.price ?? 0;
              const compareAtPrice = buyNowItem.variant?.compareAtPrice ?? buyNowItem.product?.compareAtPrice ?? 0;
              const quantity = buyNowItem.quantity;
              const subtotal = itemPrice * quantity;
              
              // Helper: Calculate savings for a product discount
              const calcProductSavings = (discount: typeof amountOffProductsOffers[0], base: number) => {
                if (discount.valueType === 'percentage' && discount.percentage) {
                  return base * (discount.percentage / 100);
                } else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
                  return Math.min(discount.fixedAmount, base);
                }
                return 0;
              };
              
              // Helper: Calculate savings for an order discount
              const calcOrderSavings = (discount: typeof amountOffOrderOffers[0], base: number) => {
                if (discount.valueType === 'percentage' && discount.percentage) {
                  return base * (discount.percentage / 100);
                } else if (discount.valueType === 'fixed-amount' && discount.fixedAmount) {
                  return Math.min(discount.fixedAmount, base);
                }
                return 0;
              };
              
              // Get all automatic discounts
              const automaticProductDiscounts = amountOffProductsOffers.filter(o => o.method === 'automatic');
              const automaticOrderDiscounts = amountOffOrderOffers.filter(o => o.method === 'automatic');
              const automaticFreeShippingList = freeShippingOffers.filter(o => o.method === 'automatic');
              
              // Find best product discount (by savings)
              let bestProductDiscount: typeof amountOffProductsOffers[0] | null = null;
              let bestProductSavings = 0;
              for (const pd of automaticProductDiscounts) {
                const savings = calcProductSavings(pd, subtotal);
                if (savings > bestProductSavings) {
                  bestProductSavings = savings;
                  bestProductDiscount = pd;
                }
              }
              
              // Find best order discount (by savings on subtotal)
              let bestOrderDiscount: typeof amountOffOrderOffers[0] | null = null;
              let bestOrderSavings = 0;
              for (const od of automaticOrderDiscounts) {
                const savings = calcOrderSavings(od, subtotal);
                if (savings > bestOrderSavings) {
                  bestOrderSavings = savings;
                  bestOrderDiscount = od;
                }
              }
              
              // --- COMBINATION VALIDATION LOGIC ---
              let appliedProductDiscount: typeof amountOffProductsOffers[0] | null = null;
              let appliedOrderDiscount: typeof amountOffOrderOffers[0] | null = null;
              let productDiscountSavings = 0;
              let orderDiscountSavings = 0;
              
              if (bestProductDiscount && bestOrderDiscount) {
                // Check if both can combine with each other
                const productAllowsOrder = bestProductDiscount.combinations?.orderDiscounts ?? false;
                const orderAllowsProduct = bestOrderDiscount.combinations?.productDiscounts ?? false;
                
                if (productAllowsOrder && orderAllowsProduct) {
                  // Both allow each other - apply both
                  appliedProductDiscount = bestProductDiscount;
                  productDiscountSavings = bestProductSavings;
                  appliedOrderDiscount = bestOrderDiscount;
                  // Order discount applies on subtotal after product discount
                  orderDiscountSavings = calcOrderSavings(bestOrderDiscount, subtotal - productDiscountSavings);
                } else {
                  // They can't combine - pick the one with better value for customer
                  // Calculate combined savings if we only apply product discount
                  const productOnlySavings = bestProductSavings;
                  // Calculate combined savings if we only apply order discount
                  const orderOnlySavings = bestOrderSavings;
                  
                  if (productOnlySavings >= orderOnlySavings) {
                    // Product discount gives better or equal value
                    appliedProductDiscount = bestProductDiscount;
                    productDiscountSavings = productOnlySavings;
                  } else {
                    // Order discount gives better value
                    appliedOrderDiscount = bestOrderDiscount;
                    orderDiscountSavings = orderOnlySavings;
                  }
                }
              } else if (bestProductDiscount) {
                // Only product discount available
                appliedProductDiscount = bestProductDiscount;
                productDiscountSavings = bestProductSavings;
              } else if (bestOrderDiscount) {
                // Only order discount available
                appliedOrderDiscount = bestOrderDiscount;
                orderDiscountSavings = bestOrderSavings;
              }
              
              // --- FREE SHIPPING VALIDATION ---
              let appliedFreeShipping: typeof freeShippingOffers[0] | null = null;
              
              // Find best free shipping that can combine with applied discounts
              for (const fs of automaticFreeShippingList) {
                let canApply = true;
                
                // Check if free shipping can combine with the applied product discount
                if (appliedProductDiscount) {
                  const productAllowsShipping = appliedProductDiscount.combinations?.shippingDiscounts ?? false;
                  const shippingAllowsProduct = fs.combinations?.productDiscounts ?? false;
                  if (!productAllowsShipping || !shippingAllowsProduct) {
                    canApply = false;
                  }
                }
                
                // Check if free shipping can combine with the applied order discount
                if (appliedOrderDiscount && canApply) {
                  const orderAllowsShipping = appliedOrderDiscount.combinations?.shippingDiscounts ?? false;
                  const shippingAllowsOrder = fs.combinations?.orderDiscounts ?? false;
                  if (!orderAllowsShipping || !shippingAllowsOrder) {
                    canApply = false;
                  }
                }
                
                if (canApply) {
                  appliedFreeShipping = fs;
                  break;
                }
              }
              
              const hasFreeShipping = !!appliedFreeShipping;
              
              // Calculate totals
              const compareAtSavings = compareAtPrice > itemPrice ? (compareAtPrice - itemPrice) * quantity : 0;
              const totalSavings = compareAtSavings + productDiscountSavings + orderDiscountSavings;
              const finalTotal = subtotal - productDiscountSavings - orderDiscountSavings;
              
              return (
                <>
                  {/* Elegant Header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => { setQuickCheckoutOpen(false); setBuyNowItem(null); }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FiArrowLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Checkout</p>
                          <h2 className="text-base font-medium text-gray-900">
                            {storeFrontMeta?.name || 'Store'}
                          </h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FiLock className="w-3.5 h-3.5" />
                        <span>Secure</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Savings Banner */}
                  {totalSavings > 0 && (
                    <div className="mx-6 mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <FiCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-emerald-800">You're saving {formatINR(totalSavings)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-0 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 180px)' }}>
                    {/* Product Item */}
                    <div className="px-6 pt-4 pb-3">
                      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                          {buyNowItem.product?.imageUrls?.[0] ? (
                            <img 
                              src={buyNowItem.product.imageUrls[0]} 
                              alt={buyNowItem.product.title || 'Product'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {buyNowItem.product?.title || 'Product'}
                          </p>
                          {buyNowItem.variant && !buyNowItem.variant.isSynthetic && Object.keys(buyNowItem.variant.optionValues || {}).length > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {Object.entries(buyNowItem.variant.optionValues)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatINR(itemPrice)}
                            </span>
                            {compareAtPrice > itemPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatINR(compareAtPrice)}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">× {quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applied Discounts */}
                    {(appliedProductDiscount || appliedOrderDiscount || hasFreeShipping) && (
                      <div className="px-6 pb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Applied Discounts</p>
                        <div className="space-y-2">
                          {appliedProductDiscount && (
                            <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg border border-green-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                                <div className="min-w-0">
                                  <span className="text-xs text-green-800 block truncate">{appliedProductDiscount.title || 'Product Discount'}</span>
                                  {appliedProductDiscount.method === 'discount-code' && appliedProductDiscount.discountCode && (
                                    <span className="text-[10px] text-green-600 block">Code: <span className="font-semibold">{appliedProductDiscount.discountCode}</span></span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-green-700 flex-shrink-0">-{formatINR(productDiscountSavings)}</span>
                            </div>
                          )}
                          {appliedOrderDiscount && (
                            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                                <div className="min-w-0">
                                  <span className="text-xs text-blue-800 block truncate">{appliedOrderDiscount.title || 'Order Discount'}</span>
                                  {appliedOrderDiscount.method === 'discount-code' && appliedOrderDiscount.discountCode && (
                                    <span className="text-[10px] text-blue-600 block">Code: <span className="font-semibold">{appliedOrderDiscount.discountCode}</span></span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-blue-700 flex-shrink-0">-{formatINR(orderDiscountSavings)}</span>
                            </div>
                          )}
                          {hasFreeShipping && appliedFreeShipping && (
                            <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                                <div className="min-w-0">
                                  <span className="text-xs text-purple-800 block truncate">{appliedFreeShipping.title || 'Free Shipping'}</span>
                                  {appliedFreeShipping.method === 'discount-code' && appliedFreeShipping.discountCode && (
                                    <span className="text-[10px] text-purple-600 block">Code: <span className="font-semibold">{appliedFreeShipping.discountCode}</span></span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-purple-700 flex-shrink-0">FREE</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Order Summary */}
                    <div className="px-6 pb-3">
                      <div className="rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">{formatINR(subtotal)}</span>
                          </div>
                          {productDiscountSavings > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">Product Discount</span>
                              <span className="text-green-600">-{formatINR(productDiscountSavings)}</span>
                            </div>
                          )}
                          {orderDiscountSavings > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-600">Order Discount</span>
                              <span className="text-blue-600">-{formatINR(orderDiscountSavings)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className={hasFreeShipping ? 'text-green-600' : 'text-gray-900'}>
                              {hasFreeShipping ? 'FREE' : 'Calculated at checkout'}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-100 flex justify-between">
                            <span className="text-sm font-semibold text-gray-900">Total</span>
                            <span className="text-sm font-semibold text-gray-900">{formatINR(finalTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Auth Section for Non-Logged-In Users */}
                    {!user ? (
                      <div className="px-6 pb-3">
                        <div className="rounded-2xl border border-gray-200 overflow-hidden">
                          <div className="p-4">
                            {/* Auth Mode Toggle */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {checkoutAuthMode === 'login' ? 'Login to continue' : 'Create an account'}
                              </p>
                            </div>
                            
                            <AnimatePresence mode="wait">
                              {checkoutAuthMode === 'login' ? (
                                <motion.div
                                  key="login-form"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.2 }}
                                  className="space-y-3"
                                >
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                                    <input
                                      type="email"
                                      placeholder="Enter your email"
                                      value={checkoutLoginForm.email}
                                      onChange={(e) => setCheckoutLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Password</label>
                                    <input
                                      type="password"
                                      placeholder="Enter your password"
                                      value={checkoutLoginForm.password}
                                      onChange={(e) => setCheckoutLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                      onKeyDown={(e) => e.key === 'Enter' && handleCheckoutLogin()}
                                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                    />
                                  </div>
                                  
                                  {checkoutLoginError && (
                                    <p className="text-xs text-red-500">{checkoutLoginError}</p>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={handleCheckoutLogin}
                                    disabled={checkoutLoginLoading || !checkoutLoginForm.email || !checkoutLoginForm.password}
                                    className="w-full px-4 py-3 text-sm bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {checkoutLoginLoading ? 'Logging in...' : 'Continue'}
                                  </button>
                                  
                                  <p className="text-center text-xs text-gray-500">
                                    Don't have an account?{' '}
                                    <button
                                      type="button"
                                      onClick={() => { setCheckoutAuthMode('signup'); setCheckoutLoginError(''); }}
                                      className="text-gray-900 font-medium hover:underline"
                                    >
                                      Sign up
                                    </button>
                                  </p>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="signup-form"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.2 }}
                                  className="space-y-3"
                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                                      <input
                                        type="text"
                                        placeholder="First name"
                                        value={checkoutSignupForm.firstName}
                                        onChange={(e) => setCheckoutSignupForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                                      <input
                                        type="text"
                                        placeholder="Last name"
                                        value={checkoutSignupForm.lastName}
                                        onChange={(e) => setCheckoutSignupForm(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                                    <input
                                      type="email"
                                      placeholder="Enter your email"
                                      value={checkoutSignupForm.email}
                                      onChange={(e) => setCheckoutSignupForm(prev => ({ ...prev, email: e.target.value }))}
                                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Password</label>
                                    <input
                                      type="password"
                                      placeholder="Create a password"
                                      value={checkoutSignupForm.password}
                                      onChange={(e) => setCheckoutSignupForm(prev => ({ ...prev, password: e.target.value }))}
                                      onKeyDown={(e) => e.key === 'Enter' && handleCheckoutSignup()}
                                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-gray-900 outline-none"
                                    />
                                  </div>
                                  
                                  {checkoutSignupError && (
                                    <p className="text-xs text-red-500">{checkoutSignupError}</p>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={handleCheckoutSignup}
                                    disabled={checkoutSignupLoading || !checkoutSignupForm.email || !checkoutSignupForm.password || !checkoutSignupForm.firstName || !checkoutSignupForm.lastName}
                                    className="w-full px-4 py-3 text-sm bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {checkoutSignupLoading ? 'Creating account...' : 'Create Account'}
                                  </button>
                                  
                                  <p className="text-center text-xs text-gray-500">
                                    Already have an account?{' '}
                                    <button
                                      type="button"
                                      onClick={() => { setCheckoutAuthMode('login'); setCheckoutSignupError(''); }}
                                      className="text-gray-900 font-medium hover:underline"
                                    >
                                      Sign in
                                    </button>
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Shipping Address - Only shown when logged in */
                      <div className="px-6 pb-3">
                        <div className="rounded-2xl border border-gray-200 overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-semibold text-gray-900">Shipping Address</p>
                              {!showAddAddressForm && (
                                <button
                                  type="button"
                                  onClick={() => setShowAddAddressForm(true)}
                                  className="text-xs font-medium text-[#d4af37] hover:text-[#b8972e]"
                                >
                                  + Add New
                                </button>
                              )}
                            </div>
                            
                            {showAddAddressForm ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="First Name *"
                                    value={addressForm.firstName}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Last Name *"
                                    value={addressForm.lastName}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Address *"
                                  value={addressForm.address}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Apartment, suite, etc. (optional)"
                                  value={addressForm.apartment}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, apartment: e.target.value }))}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="City *"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="State *"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="PIN Code *"
                                    value={addressForm.pinCode}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, pinCode: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Phone Number *"
                                    value={addressForm.phoneNumber}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none"
                                  />
                                </div>
                                <select
                                  value={addressForm.countryId}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, countryId: e.target.value }))}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none bg-white"
                                >
                                  <option value="">Select Country *</option>
                                  {countries.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                  ))}
                                </select>
                                <div className="flex gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setShowAddAddressForm(false)}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleSaveAddress}
                                    disabled={addingAddress}
                                    className="flex-1 px-3 py-2 text-sm bg-[#d4af37] text-white rounded-lg hover:bg-[#b8972e] disabled:opacity-50"
                                  >
                                    {addingAddress ? 'Saving...' : 'Save Address'}
                                  </button>
                                </div>
                              </div>
                            ) : addresses.length > 0 ? (
                              <select
                                value={selectedShippingAddressId}
                                onChange={(e) => setSelectedShippingAddressId(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] outline-none bg-white text-gray-900"
                              >
                                <option value="">Select address</option>
                                {addresses.map((addr) => (
                                  <option key={addr._id} value={addr._id}>
                                    {addr.firstName} {addr.lastName}, {addr.address}, {addr.city}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-xs text-gray-500 mb-2">No saved addresses.</p>
                                <button
                                  type="button"
                                  onClick={() => setShowAddAddressForm(true)}
                                  className="text-sm font-medium text-[#d4af37] hover:text-[#b8972e]"
                                >
                                  + Add Address
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trust badges */}
                    <div className="px-6 pb-4">
                      <div className="pt-3 border-t border-gray-100 text-center">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-2">Powered by Ziplofy</p>
                        <img src={ziplofyLogo} alt="Ziplofy" className="h-6 mx-auto mb-3 object-contain" />
                        <div className="flex items-center justify-center gap-6 text-[10px] text-gray-500">
                          <span>PCI DSS Certified</span>
                          <span>100% Secured Payments</span>
                          <span>Verified Merchant</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom primary action */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-white">
                    {user ? (
                      <motion.button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={orderLoading || !selectedShippingAddressId}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full px-6 py-3.5 text-sm rounded-full bg-black text-white font-medium tracking-wide hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {orderLoading ? 'Processing...' : `PAY ${formatINR(finalTotal)}`}
                      </motion.button>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Please login to complete your purchase</p>
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900">
                          <span>Total:</span>
                          <span>{formatINR(finalTotal)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorefrontProductDetailPage;
