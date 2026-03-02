import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCheck, FiStar } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import { motion } from 'framer-motion';
import StorefrontNavbar from '../components/StorefrontNavbar';
import AuthPopup from '../components/AuthPopup';
import type { StorefrontProductItem } from '../contexts/product.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { formatINR } from '../utils/currency';

const StorefrontApp: React.FC = () => {
  const { storeFrontMeta } = useStorefront();
  const { products, loading, pagination, orderDiscount, fetchProductsByStoreId } = useStorefrontProducts();
  const { user, logout, checkAuth } = useStorefrontAuth();
  const { getCartByCustomerId, createCartEntry } = useStorefrontCart();
  const { fetchVariantsByProductId } = useStorefrontProductVariants();
  const { collections, loading: collectionsLoading, fetchCollectionsByStoreId } = useStorefrontCollections();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 12 });
    }
  }, [storeFrontMeta?.storeId]);

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId);
    }
  }, [storeFrontMeta?.storeId]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id]);

  const handleAddToCartFromCard = useCallback(
    async (product: StorefrontProductItem, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!storeFrontMeta?.storeId) return;
      try {
        const variants = await fetchVariantsByProductId(product._id);
        const realVariants = variants.filter((v) => !v.isSynthetic);
        const variantToAdd = realVariants.length === 1 ? realVariants[0] : variants[0];
        if (variantToAdd) {
          await createCartEntry(
            {
              storeId: storeFrontMeta.storeId,
              productVariantId: variantToAdd._id,
              quantity: 1,
            },
            variantToAdd // Pass variant for guest cart
          );
        } else {
          navigate(`/products/${product._id}`);
        }
      } catch {
        navigate(`/products/${product._id}`);
      }
    },
    [storeFrontMeta?.storeId, fetchVariantsByProductId, createCartEntry, navigate]
  );

  // Build order discount text
  const orderDiscountText = orderDiscount
    ? orderDiscount.valueType === 'fixed-amount'
      ? `${formatINR(orderDiscount.fixedAmount || 0)} off`
      : `${orderDiscount.percentage || 0}% off`
    : null;

  const orderDiscountCondition = orderDiscount?.minimumPurchase === 'minimum-amount' && orderDiscount.minimumAmount
    ? `on orders above ${formatINR(orderDiscount.minimumAmount)}`
    : orderDiscount?.minimumPurchase === 'minimum-quantity' && orderDiscount.minimumQuantity
    ? `on orders with ${orderDiscount.minimumQuantity}+ items`
    : 'on all orders';

  return (
    <div className="min-h-screen bg-white">
      <StorefrontNavbar showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Order Discount Banner */}
      {orderDiscount && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-[#d4af37] via-[#e6c547] to-[#d4af37] text-[#0c100c] py-2.5 px-4 text-center shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm font-bold">{orderDiscountText}</span>
            <span className="text-xs font-medium opacity-80">{orderDiscountCondition}</span>
            {orderDiscount.title && (
              <span className="px-2.5 py-0.5 bg-white/30 backdrop-blur-sm rounded-full text-xs font-semibold">
                {orderDiscount.title}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setConfirmLogoutOpen(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-8">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { logout(); setConfirmLogoutOpen(false); }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - ORNATIVA Theme */}
      <section className={`relative overflow-hidden bg-gradient-to-br from-[#fefcf8] via-[#f5f1e8] to-[#e8e0d5] min-h-[85vh] flex items-center ${orderDiscount ? 'mt-28' : 'mt-20'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#e6c547] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6"
            >
              <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#0c100c]">Timeless Luxury, Crafted for You</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0c100c] mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {storeFrontMeta?.name || 'Welcome to Our Store'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#2b1e1e] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {storeFrontMeta?.description || 'Discover amazing products at unbeatable prices. Shop the latest trends and timeless classics.'}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-10"
            >
              {[
                { icon: FiStar, value: '10K+', label: 'Happy Customers' },
                { icon: FiShoppingCart, value: '500+', label: 'Products' },
                { icon: FiHeadphones, value: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-[#e8e0d5]">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center shadow-sm">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-[#0c100c]">{stat.value}</div>
                    <div className="text-xs text-[#2b1e1e]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-semibold text-sm hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)' }}
              >
                Shop Now
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 rounded-xl bg-[#0c100c] text-[#fefcf8] font-semibold text-sm hover:bg-[#2b1e1e] transition-all duration-300 hover:scale-105"
              >
                Explore Collections
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section - ORNATIVA Theme */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">Why Us</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0c100c] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Why Choose Us</h2>
            <p className="text-sm text-[#2b1e1e] max-w-xl mx-auto">Experience shopping like never before with our premium service</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₹500' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated support team' },
              { icon: FiCheck, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-[#fefcf8] border border-[#e8e0d5] hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center mb-4 mx-auto shadow-lg shadow-[#d4af37]/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0c100c] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#2b1e1e]">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collections Section - ORNATIVA Theme */}
      {collections.length > 0 && (
        <section id="collections" className="relative py-20 bg-gradient-to-b from-[#f5f1e8] to-[#fefcf8] overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">Collections</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0c100c] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Shop by Collections
              </h2>
              <p className="text-sm text-[#2b1e1e] max-w-xl mx-auto">
                Discover our curated collections featuring the latest trends and timeless classics
              </p>
            </motion.div>

            {collectionsLoading && (
              <div className="text-center py-16">
                <div className="inline-block rounded-full h-12 w-12 border-4 border-[#e8e0d5] border-t-[#d4af37] animate-spin" />
                <p className="text-[#2b1e1e] mt-4">Loading collections...</p>
              </div>
            )}

            {!collectionsLoading && collections.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {collections.map((c, index) => (
                  <CollectionCard key={c._id} collection={c} navigate={navigate} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products Section - ORNATIVA Theme */}
      <section id="products" className="relative py-20 bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">Featured</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0c100c] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Featured Products</h2>
            <p className="text-sm text-[#2b1e1e] max-w-xl mx-auto">
              Handpicked products that our customers love
            </p>
          </motion.div>

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block rounded-full h-12 w-12 border-4 border-[#e8e0d5] border-t-[#d4af37] animate-spin" />
              <p className="text-[#2b1e1e] mt-4">Loading products...</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {products
                .filter((p) => {
                  if (!search) return true;
                  const q = search.toLowerCase();
                  return p.title?.toLowerCase().includes(q) || (p.vendor?.name || '').toLowerCase().includes(q);
                })
                .map((p, index) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onClick={() => navigate(`/products/${p._id}`)}
                    onAddToCart={handleAddToCartFromCard}
                    index={index}
                  />
                ))}
            </div>
          )}

          {pagination?.hasNext && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-14"
            >
              <button
                type="button"
                onClick={() => storeFrontMeta?.storeId && fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: (pagination?.page || 1) + 1, limit: pagination?.limit || 12 })}
                className="group px-8 py-3.5 bg-[#0c100c] text-white rounded-xl font-semibold hover:bg-[#2b1e1e] transition-all flex items-center gap-2 mx-auto hover:scale-105"
              >
                Load More Products
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer - ORNATIVA Theme */}
      <footer className="bg-[#0c100c] text-[#fefcf8] relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e6c547]/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-[#d4af37]/20">
                  {storeFrontMeta?.name?.charAt(0) || 'Z'}
                </div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  {storeFrontMeta?.name || 'Store'}
                </div>
              </div>
              <p className="text-gray-400 mb-5 text-sm leading-relaxed max-w-xs">
                {storeFrontMeta?.description || 'Your trusted online shopping destination for quality products at great prices.'}
              </p>
              <div className="flex gap-2">
                {[FaFacebook, FaTwitter, FaInstagram, FaPinterest].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#d4af37] text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 border border-white/5 hover:border-[#d4af37]"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-white" style={{ fontFamily: 'var(--font-serif)' }}>Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {['About Us', 'Contact', 'FAQ', 'Blog'].map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="text-left text-gray-400 hover:text-[#d4af37] text-sm transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-white" style={{ fontFamily: 'var(--font-serif)' }}>Customer Service</h4>
              <div className="flex flex-col gap-2.5">
                {['Help Center', 'Shipping Info', 'Returns', 'Track Order'].map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="text-left text-gray-400 hover:text-[#d4af37] text-sm transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-white" style={{ fontFamily: 'var(--font-serif)' }}>Stay Connected</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe for exclusive offers.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors text-sm"
                />
                <button
                  type="button"
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-bold text-sm hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all hover:scale-[1.02]"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {storeFrontMeta?.name || 'Store'}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                <button
                  key={link}
                  type="button"
                  className="text-gray-500 hover:text-[#d4af37] text-sm transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AuthPopup open={authPopupOpen} onClose={() => setAuthPopupOpen(false)} />
    </div>
  );
};

// Modern Collection Card Component - ORNATIVA Theme
const CollectionCard: React.FC<{
  collection: any;
  navigate: (path: string) => void;
  index: number;
}> = ({ collection, navigate, index }) => {
  const gradients = [
    'from-[#f5f1e8] to-[#e8e0d5]',
    'from-[#e8e0d5] to-[#fefcf8]',
    'from-[#fefcf8] to-[#f5f1e8]',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#e8e0d5]/50 hover:border-[#d4af37]/30 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => navigate(`/collections/${collection._id}/${collection.urlHandle}`)}
        className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 rounded-2xl"
      >
        {/* Image/Header Section */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#d4af37]/10 blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-[#e6c547]/10 blur-2xl" />

          {/* Collection Icon/Initial */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center shadow-xl shadow-[#d4af37]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                {collection.title.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-base font-bold text-[#0c100c] mb-1.5 line-clamp-1 group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
            {collection.title}
          </h3>
          <p className="text-xs text-[#2b1e1e] leading-relaxed line-clamp-2 mb-4">
            {collection.metaDescription || collection.description || 'Explore this curated collection'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#2b1e1e]/60 uppercase tracking-wider font-medium px-2 py-1 rounded-md bg-[#f5f1e8]">
              {collection.urlHandle}
            </span>
            <div className="flex items-center gap-1.5 text-[#d4af37] font-semibold text-xs group-hover:gap-2 transition-all duration-300">
              <span>View</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

// Minimal Product Card Component with Gold Theme
const ProductCard: React.FC<{
  product: StorefrontProductItem;
  onClick: () => void;
  onAddToCart: (product: StorefrontProductItem, e: React.MouseEvent) => void;
  index?: number;
}> = ({ product, onClick, onAddToCart, index = 0 }) => {
  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ['https://via.placeholder.com/600x400?text=Product'];
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(t);
  }, [images.length]);

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const productOfferText = product.productDiscount
    ? product.productDiscount.valueType === 'fixed-amount'
      ? `${formatINR(product.productDiscount.fixedAmount || 0)} off`
      : `${product.productDiscount.percentage || 0}% off`
    : null;

  const isCodeBased = product.productDiscount?.method === 'discount-code';
  const discountCode = product.productDiscount?.discountCode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        {images.map((src, i) => (
          <img
            key={i}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              i === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isHovered ? 'scale-110' : ''}`}
            src={src}
            alt={product.title}
          />
        ))}

        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Discount Badge */}
        {productOfferText && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-white shadow-lg">
            {productOfferText}
          </span>
        )}

        {/* Sale Badge */}
        {discountPercentage > 0 && !productOfferText && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-white shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, e);
          }}
          className={`absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-[#0c100c] text-white text-xs font-semibold hover:bg-[#d4af37] transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } flex items-center justify-center gap-2`}
        >
          <FiShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === idx ? 'bg-[#d4af37] w-4' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor */}
        {product.vendor?.name && (
          <p className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
            {product.vendor.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-[#0c100c] line-clamp-2 mb-3 min-h-[2.5rem] leading-snug group-hover:text-[#d4af37] transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#0c100c]">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>

        {/* Discount Code */}
        {isCodeBased && discountCode && (
          <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-[#d4af37]/10 rounded text-[#d4af37] font-semibold">{discountCode}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StorefrontApp;
