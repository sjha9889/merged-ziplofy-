import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCheck } from 'react-icons/fi';
import { FaStar, FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import StorefrontNavbar from '../components/StorefrontNavbar';
import type { StorefrontProductItem } from '../contexts/product.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';

const StorefrontApp: React.FC = () => {
  const { storeFrontMeta } = useStorefront();
  const { products, loading, pagination, fetchProductsByStoreId } = useStorefrontProducts();
  const { user, logout, checkAuth } = useStorefrontAuth();
  const { getCartByCustomerId } = useStorefrontCart();
  const { collections, loading: collectionsLoading, fetchCollectionsByStoreId } = useStorefrontCollections();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-white">
      <StorefrontNavbar showSearch searchValue={search} onSearchChange={setSearch} />

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
      <section className="relative mt-20 overflow-hidden bg-gradient-to-br from-[#fefcf8] via-[#f5f1e8] to-[#e8e0d5] min-h-[85vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle gold accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#e6c547] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6">
              <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#0c100c]">Timeless Luxury, Crafted for You</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0c100c] mb-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              {storeFrontMeta?.name || 'Welcome to Our Store'}
            </h1>
            <p className="text-base sm:text-lg text-[#2b1e1e] mb-8 max-w-2xl mx-auto leading-relaxed">
              {storeFrontMeta?.description || 'Discover amazing products at unbeatable prices. Shop the latest trends and timeless classics.'}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <FiTruck className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-[#0c100c]">10K+</div>
                  <div className="text-xs text-[#2b1e1e]">Happy Customers</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <FiShoppingCart className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-[#0c100c]">500+</div>
                  <div className="text-xs text-[#2b1e1e]">Products</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                  <FiHeadphones className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-semibold text-[#0c100c]">24/7</div>
                  <div className="text-xs text-[#2b1e1e]">Support</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('#products')}
                className="group px-8 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
              >
                Shop Now
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('#collections')}
                className="px-8 py-3 rounded-lg border-2 border-[#0c100c] text-[#0c100c] font-semibold text-sm hover:bg-[#0c100c] hover:text-[#fefcf8] transition-all duration-300"
              >
                Explore Collections
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section - ORNATIVA Theme */}
      <section className="py-16 bg-[#fefcf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0c100c] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Why Choose Us</h2>
            <p className="text-sm text-[#2b1e1e] max-w-2xl mx-auto">Experience shopping like never before</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated support team' },
              { icon: FiCheck, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-5 rounded-lg bg-white border border-[#e8e0d5] hover:border-[#d4af37] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#d4af37] transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0c100c] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#2b1e1e] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Collections Section - ORNATIVA Theme */}
      {collections.length > 0 && (
        <section id="collections" className="relative py-20 bg-[#f5f1e8] overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-5">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
                <span className="text-xs font-semibold text-[#0c100c] uppercase tracking-wide">
                  Collections
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0c100c] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Shop by Collections
              </h2>
              <p className="text-sm text-[#2b1e1e] max-w-2xl mx-auto">
                Discover our curated collections featuring the latest trends and timeless classics
              </p>
            </div>

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
      <section id="products" className="relative py-20 bg-[#fefcf8] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-5">
              <span className="w-2 h-2 bg-[#d4af37] rounded-full" />
              <span className="text-xs font-semibold text-[#0c100c] uppercase tracking-wide">
                Featured Selection
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0c100c] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Featured Products</h2>
            <p className="text-sm text-[#2b1e1e] max-w-2xl mx-auto">
              Handpicked products that our customers love
            </p>
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block rounded-full h-12 w-12 border-4 border-[#e8e0d5] border-t-[#d4af37] animate-spin" />
              <p className="text-[#2b1e1e] mt-4">Loading products...</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter((p) => {
                  if (!search) return true;
                  const q = search.toLowerCase();
                  return p.title?.toLowerCase().includes(q) || (p.vendor?.name || '').toLowerCase().includes(q);
                })
                .map((p) => (
                  <ProductCard key={p._id} product={p} onClick={() => navigate(`/products/${p._id}`)} />
                ))}
            </div>
          )}

          {pagination?.hasNext && (
            <div className="text-center mt-16">
              <button
                type="button"
                onClick={() => storeFrontMeta?.storeId && fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: (pagination?.page || 1) + 1, limit: pagination?.limit || 12 })}
                className="group px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
              >
                Load More Products
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </section>

      {/* Footer - ORNATIVA Theme */}
      <footer className="bg-[#0c100c] text-[#fefcf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center text-[#0c100c] text-xl font-black shadow-lg">
                  {storeFrontMeta?.name?.charAt(0) || 'Z'}
                </div>
                <div className="text-lg font-semibold text-[#fefcf8]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {storeFrontMeta?.name || 'Store'}
                </div>
              </div>
              <p className="text-[#f5f1e8] mb-6 text-xs leading-relaxed">
                {storeFrontMeta?.description || 'Your trusted online shopping destination for quality products at great prices.'}
              </p>
              <div className="flex gap-3">
                {[FaFacebook, FaTwitter, FaInstagram, FaPinterest].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-12 h-12 rounded-lg bg-[#2b1e1e] hover:bg-[#d4af37] text-[#fefcf8] hover:text-[#0c100c] transition-all duration-300 flex items-center justify-center hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-base" style={{ fontFamily: 'var(--font-serif)' }}>Quick Links</h4>
              <div className="flex flex-col gap-3">
                {['About Us', 'Contact', 'FAQ', 'Blog'].map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="text-left text-[#f5f1e8] hover:text-[#d4af37] text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-6 text-base" style={{ fontFamily: 'var(--font-serif)' }}>Customer Service</h4>
              <div className="flex flex-col gap-3">
                {['Help Center', 'Shipping Info', 'Returns', 'Track Order'].map((link) => (
                  <button
                    key={link}
                    type="button"
                    className="text-left text-[#f5f1e8] hover:text-[#d4af37] text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4 text-base" style={{ fontFamily: 'var(--font-serif)' }}>Stay Connected</h4>
              <p className="text-[#f5f1e8] mb-4 text-xs">
                Subscribe to get updates on new products and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-5 py-3 rounded-lg bg-[#2b1e1e] border-2 border-[#2b1e1e] text-[#fefcf8] placeholder-[#f5f1e8]/50 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="button"
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-bold hover:shadow-lg transition-all"
                  style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2b1e1e] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#f5f1e8] text-sm">
              © {new Date().getFullYear()} {storeFrontMeta?.name || 'Store'}. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <button
                  key={link}
                  type="button"
                  className="text-[#f5f1e8] hover:text-[#d4af37] text-sm transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Modern Collection Card Component - ORNATIVA Theme
const CollectionCard: React.FC<{
  collection: any;
  navigate: (path: string) => void;
  index: number;
}> = ({ collection, navigate, index }) => {
  const bgColors = [
    'bg-[#f5f1e8]',
    'bg-[#e8e0d5]',
    'bg-[#fefcf8]',
  ];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <div className="group bg-white border border-[#e8e0d5] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#d4af37] transition-all duration-300 hover:-translate-y-1">
      <button
        type="button"
        onClick={() => navigate(`/collections/${collection._id}/${collection.urlHandle}`)}
        className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 rounded-lg"
      >
        {/* Image/Header Section */}
        <div className={`relative h-44 ${bgColor} overflow-hidden`}>
          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#d4af37]/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

          {/* Status Badge */}
          {(collection.onlineStorePublishing || collection.pointOfSalePublishing) && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              {collection.onlineStorePublishing && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 backdrop-blur-sm text-[#0c100c] border border-[#e8e0d5] shadow-sm">
                  Online
                </span>
              )}
              {collection.pointOfSalePublishing && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 backdrop-blur-sm text-[#0c100c] border border-[#e8e0d5] shadow-sm">
                  POS
                </span>
              )}
            </div>
          )}

          {/* Collection Icon/Initial */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-3xl font-bold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>
                {collection.title.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#0c100c] mb-2 line-clamp-1 group-hover:text-[#d4af37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
            {collection.title}
          </h3>
          <p className="text-xs text-[#2b1e1e] leading-relaxed line-clamp-2 mb-5 min-h-[2.5rem]">
            {collection.metaDescription || collection.description || 'Explore this curated collection'}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-[#e8e0d5]">
            <span className="text-xs text-[#2b1e1e] uppercase tracking-wider font-medium">
              {collection.urlHandle}
            </span>
            <div className="flex items-center gap-1.5 text-[#2b1e1e] group-hover:text-[#d4af37] group-hover:gap-2 transition-all duration-300">
              <span className="text-xs font-semibold">View Collection</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

// Modern Product Card Component
const ProductCard: React.FC<{ 
  product: StorefrontProductItem; 
  onClick: () => void;
}> = ({ product, onClick }) => {
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

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-white border border-[#e8e0d5] hover:shadow-lg hover:border-[#d4af37] transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 rounded-lg"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-[#f5f1e8]">
          {images.map((src, i) => (
            <img
              key={i}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                i === idx ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105 transition-transform duration-700`}
              src={src}
              alt={product.title}
            />
          ))}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-[#d4af37] text-[#0c100c] px-2.5 py-1 rounded-md text-xs font-bold shadow-md">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <div className={`absolute top-3 right-3 z-10 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // Handle wishlist logic here
              }}
              className="p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-lg transition-all shadow-md hover:scale-110"
            >
              <FiHeart className="w-4 h-4 text-[#0c100c]" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-5">
          {/* Vendor */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-medium text-[#2b1e1e] uppercase tracking-wide">
              {product.vendor?.name || 'Brand'}
            </span>
          </div>

          <h3 className="text-base font-semibold text-[#0c100c] mb-2.5 line-clamp-2 leading-snug group-hover:text-[#d4af37] transition-colors duration-300">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#d4af37]">
              ${(product.price / 100).toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-[#2b1e1e]/60 line-through">
                ${(product.compareAtPrice / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar
                key={i}
                className={`w-3.5 h-3.5 ${i <= 4 ? 'text-[#d4af37] fill-[#d4af37]' : 'text-[#e8e0d5]'}`}
              />
            ))}
            <span className="text-xs text-[#2b1e1e]/60 ml-1">(4.0)</span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Handle add to cart logic here
            }}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] text-sm font-semibold hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
          >
            Add to Cart
          </button>
        </div>
      </button>
    </div>
  );
};

export default StorefrontApp;
