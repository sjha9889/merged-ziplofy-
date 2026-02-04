import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import StorefrontNavbar from '../components/StorefrontNavbar';
import type { StorefrontProductItem } from '../contexts/product.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';

const StorefrontApp: React.FC = () => {
  const { storeFrontMeta } = useStorefront();
  const { products, loading, error, pagination, fetchProductsByStoreId } = useStorefrontProducts();
  const { user, logout, checkAuth } = useStorefrontAuth();
  const { getCartByCustomerId } = useStorefrontCart();
  const { collections, loading: collectionsLoading, error: collectionsError, fetchCollectionsByStoreId } = useStorefrontCollections();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <StorefrontNavbar showSearch searchValue={search} onSearchChange={setSearch} />

      {/* Confirm Logout Modal */}
      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmLogoutOpen(false)}>
          <div className="rounded-2xl bg-white p-6 shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmLogoutOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => { logout(); setConfirmLogoutOpen(false); }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className={`transition-opacity duration-800 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent`}>
              {storeFrontMeta?.name || 'Our Store'}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl">
              {storeFrontMeta?.description || 'Discover amazing products at unbeatable prices'}
            </p>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">Shop by Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections featuring the latest trends and timeless classics
            </p>
          </div>

          {collectionsLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading collections...</p>
            </div>
          )}
          {collectionsError && (
            <div className="text-center py-8">
              <p className="text-red-600">{collectionsError}</p>
            </div>
          )}

          {!collectionsLoading && collections.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {collections.map((c, index) => (
                <div
                  key={c._id}
                  className={`h-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/collections/${c._id}/${c.urlHandle}`)}
                    className="w-full h-full text-left"
                  >
                    <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
                      <h3 className="text-4xl font-black text-white opacity-90">
                        {c.title.charAt(0)}
                      </h3>
                      <div className="absolute top-4 right-4 flex gap-2">
                        {c.onlineStorePublishing && (
                          <span className="px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium">Online</span>
                        )}
                        {c.pointOfSalePublishing && (
                          <span className="px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium">POS</span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {c.metaDescription || c.description}
                      </p>
                      <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-700">
                        {c.urlHandle}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked products that our customers love
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading products...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((p) => {
                  if (!search) return true;
                  const q = search.toLowerCase();
                  const inTitle = p.title?.toLowerCase().includes(q);
                  const inVendor = (p.vendor?.name || '').toLowerCase().includes(q);
                  return inTitle || inVendor;
                })
                .map((p, index) => (
                  <div
                    key={p._id}
                    className={`${
                      heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <ProductCard product={p} onClick={() => navigate(`/products/${p._id}`)} />
                  </div>
                ))}
            </div>
          )}

          {pagination?.hasNext && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() => storeFrontMeta?.storeId && fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: (pagination?.page || 1) + 1, limit: pagination?.limit || 12 })}
                className="px-8 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-800 to-gray-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{storeFrontMeta?.name || 'Our Store'}</h3>
              <p className="text-gray-300 mb-4 text-sm">
                {storeFrontMeta?.description || 'Your trusted online shopping destination for quality products at great prices.'}
              </p>
              <div className="flex gap-2">
                <button type="button" className="p-2 text-white/80 hover:text-white transition-colors">
                  <FiTrendingUp className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 text-white/80 hover:text-white transition-colors">
                  <FiShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  About Us
                </button>
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  Contact
                </button>
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  FAQ
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="flex flex-col gap-2">
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  Help Center
                </button>
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  Shipping Info
                </button>
                <button type="button" className="text-left text-white/80 hover:text-white text-sm transition-colors">
                  Returns
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4 text-sm">
                Subscribe to get updates on new products and exclusive offers.
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-white/30 text-white hover:border-white transition-colors text-sm"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} {storeFrontMeta?.name || 'Our Store'}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <button type="button" className="text-white/80 hover:text-white text-sm transition-colors">
                Privacy Policy
              </button>
              <button type="button" className="text-white/80 hover:text-white text-sm transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontApp;

// Modern Product Card with enhanced design
const ProductCard: React.FC<{ product: StorefrontProductItem; onClick: () => void }> = ({ product, onClick }) => {
  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/600x400?text=Product'];
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
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
      className="h-full relative overflow-hidden rounded-2xl border border-gray-200 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full flex flex-col"
      >
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {images.map((src, i) => (
            <img
              key={i}
              className={`product-image absolute inset-0 w-full h-full object-contain transition-opacity duration-600 ${
                i === idx ? 'opacity-100' : 'opacity-0'
              }`}
              src={src}
              alt={product.title}
            />
          ))}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <div className={`absolute top-3 right-3 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              type="button"
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
            >
              <FaStar className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Quick View Overlay */}
          {isHovered && (
            <div className="absolute bottom-3 left-3 right-3 z-10 transition-opacity duration-300">
              <button
                type="button"
                className="w-full py-2 rounded-lg bg-black/80 text-white font-semibold hover:bg-black/90 transition-colors text-sm"
              >
                Quick View
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <h3 className="text-lg font-bold mb-1 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-sm text-gray-600">{product.vendor?.name || 'Brand'}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-extrabold text-indigo-600">
              ${(product.price / 100).toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${(product.compareAtPrice / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <FaStar key={i} className="w-4 h-4 text-yellow-400" />
            ))}
            <FaStar className="w-4 h-4 text-gray-300" />
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>
      </button>
    </div>
  );
};
