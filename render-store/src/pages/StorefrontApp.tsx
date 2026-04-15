import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { StorefrontProductItem } from '../contexts/product.context';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontCollections } from '../contexts/storefront-collections.context';
import { useStorefrontSearch } from '../contexts/storefront-search.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { formatINR } from '../utils/currency';

const CATEGORY_IMGS = [
  '/assets/img/category-1.jpg', '/assets/img/category-2.jpg', '/assets/img/category-3.jpg',
  '/assets/img/category-4.jpg', '/assets/img/category-5.jpg', '/assets/img/category-6.jpg',
  '/assets/img/category-7.jpg', '/assets/img/category-8.jpg', '/assets/img/category-9.jpg',
  '/assets/img/category-10.jpg', '/assets/img/category-11.jpg', '/assets/img/category-12.jpg',
];
const COLLECTION_IMGS = ['/assets/img/collection-1.webp', '/assets/img/collection-6.webp', '/assets/img/collection-8.webp', '/assets/img/collection-5.webp'];

function ProductCardDeals({
  product,
  onAddToCart,
}: {
  product: StorefrontProductItem;
  onAddToCart: (p: StorefrontProductItem, e: React.MouseEvent) => void;
}) {
  const img = (product.imageUrls && product.imageUrls[0]) || '/assets/img/watch-1.jpg';
  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-card-image">
          <img src={img} alt={product.title} width={200} height={180} />
          <div className="product-card-icons">
            <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <button type="button" className="product-icon-btn" aria-label="Compare">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button type="button" className="product-icon-btn" aria-label="Quick view">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
        </div>
        <div className="product-timer">276 Days : 10 Hours : 44 Mins : 39 Secs</div>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">⭐⭐⭐⭐☆ <span>(189)</span></div>
        <div className="product-price">
          <span className="price-current">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="price-old">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
      </Link>
      <div className="product-actions">
        <Link to="/wishlist" className="btn-wishlist" aria-label="Add to wishlist">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </Link>
        <button type="button" className="btn-add-cart" onClick={(e) => { e.preventDefault(); onAddToCart(product, e as unknown as React.MouseEvent); }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function ListingCard({ product }: { product: StorefrontProductItem }) {
  const img = (product.imageUrls && product.imageUrls[0]) || '/assets/img/category-12.jpg';
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="listing-card">
      <div className="listing-image">
        <img src={img} alt={product.title} width={110} height={110} />
      </div>
      <div className="listing-content">
        {discount > 0 && <span className="listing-badge">{discount}% OFF</span>}
        <h3 className="listing-title">{product.title}</h3>
        <div className="listing-rating">⭐⭐⭐⭐☆ <span>(189)</span></div>
        <div className="listing-price">
          <span className="listing-price-current">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="listing-price-old">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function DayDealCard({
  product,
  onAddToCart,
  slideIndex,
}: {
  product: StorefrontProductItem;
  onAddToCart: (p: StorefrontProductItem, e: React.MouseEvent) => void;
  slideIndex: number;
}) {
  const img = (product.imageUrls && product.imageUrls[0]) || `/assets/img/watch-${(slideIndex % 10) + 1}.jpg`;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="day-deals-slide">
      <Link to={`/products/${product._id}`} className="day-deal-card" data-slide={slideIndex}>
        <div className="day-deal-image">
          <img src={img} alt={product.title} width={280} height={200} />
        </div>
        <div className="day-deal-content">
          {discount > 0 && <span className="day-deal-badge">{discount}% OFF</span>}
          <h3 className="day-deal-title">{product.title}</h3>
          <div className="day-deal-rating">⭐⭐⭐⭐½ <span>(189)</span></div>
          <div className="day-deal-colors">
            <span className="color-dot" style={{ background: '#7C3AED' }}></span>
            <span className="color-dot" style={{ background: '#6EE7B7' }}></span>
            <span className="color-dot" style={{ background: '#FDE68A' }}></span>
            <span className="color-dot" style={{ background: '#93C5FD' }}></span>
            <span className="color-dot" style={{ background: '#3B82F6' }}></span>
          </div>
          <div className="day-deal-timer">
            <div className="timer-box"><span className="timer-value">276</span><span className="timer-label">Days</span></div>
            <div className="timer-box"><span className="timer-value">10</span><span className="timer-label">Hours</span></div>
            <div className="timer-box"><span className="timer-value">12</span><span className="timer-label">Minutes</span></div>
            <div className="timer-box"><span className="timer-value">58</span><span className="timer-label">Seconds</span></div>
          </div>
          <div className="day-deal-stock">
            <span>Sold: 4</span>
            <div className="stock-bar"><div className="stock-fill"></div></div>
            <span>Available: 200</span>
          </div>
          <div className="day-deal-bottom">
            <div className="day-deal-price">
              <span className="day-deal-current">{formatINR(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="day-deal-old">{formatINR(product.compareAtPrice)}</span>
              )}
            </div>
            <span className="day-deal-cta" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product, e as unknown as React.MouseEvent); }} role="button" tabIndex={0}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Add to Cart
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function FeaturedTechCard({ product }: { product: StorefrontProductItem }) {
  const img = (product.imageUrls && product.imageUrls[0]) || '/assets/img/watch-1.jpg';
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="featured-tech-card featured-tech-side">
      <div className="featured-tech-card-img">
        <img src={img} alt={product.title} width={120} height={90} />
      </div>
      <div className="featured-tech-card-content">
        {discount > 0 && <span className="featured-tech-badge">{discount}% OFF</span>}
        <h3 className="featured-tech-name">{product.title}</h3>
        <div className="featured-tech-rating">⭐⭐⭐⭐½ <span>(189)</span></div>
        <div className="featured-tech-price">
          <span className="featured-tech-current">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="featured-tech-old">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

const StorefrontApp: React.FC = () => {
  const { storeFrontMeta } = useStorefront();
  const { products, loading, fetchProductsByStoreId } = useStorefrontProducts();
  const { user } = useStorefrontAuth();
  const { getCartByCustomerId, createCartEntry } = useStorefrontCart();
  const { fetchVariantsByProductId } = useStorefrontProductVariants();
  const { collections, fetchCollectionsByStoreId } = useStorefrontCollections();
  const navigate = useNavigate();
  const { searchValue: search } = useStorefrontSearch();
  const storeName = storeFrontMeta?.name || 'Chronova';

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 });
    }
  }, [storeFrontMeta?.storeId, fetchProductsByStoreId]);

  useEffect(() => {
    if (storeFrontMeta?.storeId) {
      fetchCollectionsByStoreId(storeFrontMeta.storeId);
    }
  }, [storeFrontMeta?.storeId, fetchCollectionsByStoreId]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id, getCartByCustomerId]);

  const handleAddToCart = useCallback(
    async (product: StorefrontProductItem, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!storeFrontMeta?.storeId) return;
      try {
        const variants = await fetchVariantsByProductId(product._id);
        const realVariants = variants.filter((v) => !v.isSynthetic);
        const variantToAdd = realVariants.length === 1 ? realVariants[0] : variants[0];
        if (variantToAdd) {
          await createCartEntry(
            { storeId: storeFrontMeta.storeId, productVariantId: variantToAdd._id, quantity: 1 },
            variantToAdd
          );
          window.dispatchEvent(new CustomEvent('open-cart-drawer'));
        } else {
          navigate(`/products/${product._id}`);
        }
      } catch {
        navigate(`/products/${product._id}`);
      }
    },
    [storeFrontMeta?.storeId, fetchVariantsByProductId, createCartEntry, navigate]
  );

  const filteredProducts = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || (p.vendor?.name || '').toLowerCase().includes(q);
  });
  const dealsProducts = filteredProducts.slice(0, 6);
  const listingProducts = filteredProducts.slice(0, 8);
  const dayDealsProducts = filteredProducts.slice(0, 6);
  const featuredProducts = filteredProducts.slice(0, 5);

  return (
    <>
      <section className="hero-wrap" data-aos="fade-up" data-aos-duration="600">
        <div className="hero">
          <div className="hero-track" id="hero-track">
            <div className="hero-slide active">
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-label">Exclusive offer</span>
                  <span className="hero-badge">25% OFF</span>
                  <h1>Precision Timepieces Crafted for Modern Elegance.</h1>
                  <p>Discover premium watches that combine timeless design with modern technology. Elevate your style with {storeName}&apos;s finest collection.</p>
                  <Link to="/category" className="hero-cta">Shop Now <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="hero-slide">
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-label">Limited Edition</span>
                  <span className="hero-badge">30% OFF</span>
                  <h1>Luxury Automatic Watches for Every Occasion.</h1>
                  <p>Explore our handcrafted automatic timepieces. Swiss precision meets contemporary design in every detail.</p>
                  <Link to="/category" className="hero-cta">Explore Now <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="hero-slide">
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-label">New Arrivals</span>
                  <span className="hero-badge">Free Shipping</span>
                  <h1>Smart Watches for the Connected Lifestyle.</h1>
                  <p>Stay connected with our latest smartwatch range. Fitness tracking, notifications, and sleek design in one.</p>
                  <Link to="/category" className="hero-cta">Shop Smart <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
                </div>
              </div>
            </div>
            <div className="hero-slide">
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-label">Best Sellers</span>
                  <span className="hero-badge">Top Rated</span>
                  <h1>Classic Leather &amp; Stainless Steel Designs.</h1>
                  <p>From boardroom to weekend, our classic collection delivers sophistication and reliability you can count on.</p>
                  <Link to="/category" className="hero-cta">View Collection <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="hero-prev" id="hero-prev" aria-label="Previous slide">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" className="hero-next" id="hero-next" aria-label="Next slide">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="hero-dots" id="hero-dots">
            <button type="button" className="hero-dot active" data-slide="0" aria-label="Slide 1"></button>
            <button type="button" className="hero-dot" data-slide="1" aria-label="Slide 2"></button>
            <button type="button" className="hero-dot" data-slide="2" aria-label="Slide 3"></button>
            <button type="button" className="hero-dot" data-slide="3" aria-label="Slide 4"></button>
          </div>
        </div>
      </section>

      <section className="categories" aria-labelledby="categories-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="categories-inner">
          <h2 id="categories-heading" className="sr-only">Product Categories</h2>
          <div className="categories-grid">
            {collections.length > 0
              ? collections.slice(0, 12).map((c, i) => (
                  <Link key={c._id} to={`/collections/${c._id}/${c.urlHandle}`} className="category-card">
                    <img src={CATEGORY_IMGS[i % CATEGORY_IMGS.length]} alt={c.title} width={60} height={60} />
                    <span>{c.title}</span>
                  </Link>
                ))
              : CATEGORY_IMGS.slice(0, 12).map((src, i) => (
                  <Link key={i} to="/category" className="category-card">
                    <img src={src} alt="Category" width={60} height={60} />
                    <span>Category {i + 1}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="deals" aria-labelledby="deals-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="deals-inner">
          <header className="deals-header">
            <div className="deals-header-left">
              <h2 id="deals-heading">Limited Time Watch Deals</h2>
              <p className="deals-sub">Special pricing on premium timepieces for a limited time.</p>
            </div>
            <div className="deals-header-right">
              <div className="deals-countdown" id="deals-countdown">Ends in: 276 : 10 : 44 : 39</div>
              <div className="deals-filters">
                <button type="button" className="deals-filter active" data-filter="all">View All</button>
                <button type="button" className="deals-filter" data-filter="phones">Smart Phones</button>
                <button type="button" className="deals-filter" data-filter="camera">Camera</button>
                <button type="button" className="deals-filter" data-filter="headphone">Headphone</button>
              </div>
            </div>
          </header>
          <div className="deals-grid">
            {loading ? (
              <div className="deals-loading">Loading...</div>
            ) : dealsProducts.length > 0 ? (
              dealsProducts.map((p) => (
                <ProductCardDeals key={p._id} product={p} onAddToCart={handleAddToCart} />
              ))
            ) : (
              <p className="deals-empty">No deals at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="promo-wrap" aria-labelledby="promo-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="promo-inner">
          <div className="promo-banner">
            <div className="promo-card">
              <h2 id="promo-heading">Hurry! Limited Deals</h2>
              <p className="promo-sub">Watches you love, prices you&apos;ll love more.</p>
              <div className="promo-countdown">
                <div className="countdown-block countdown-days"><span className="countdown-label">Days</span><span className="countdown-value" id="promo-days">276</span></div>
                <div className="countdown-block countdown-hours"><span className="countdown-label">Hours</span><span className="countdown-value" id="promo-hours">10</span></div>
                <div className="countdown-block countdown-mins"><span className="countdown-label">Mins</span><span className="countdown-value" id="promo-mins">34</span></div>
                <div className="countdown-block countdown-secs"><span className="countdown-label">Secs</span><span className="countdown-value" id="promo-secs">29</span></div>
              </div>
              <Link to="/category" className="promo-cta">Explore Watches <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
            </div>
          </div>
          <div className="brand-logos">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="brand-logo" aria-hidden="true">Logoipsum</span>
            ))}
          </div>
        </div>
      </section>

      <section className="listing-section" aria-labelledby="listing-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="listing-inner">
          <header className="listing-header">
            <h2 id="listing-heading">Premium Watch Collection</h2>
            <Link to="/category" className="listing-view-all">View All</Link>
          </header>
          <div className="listing-grid">
            {loading ? (
              <div className="listing-loading">Loading...</div>
            ) : listingProducts.length > 0 ? (
              listingProducts.map((p) => (
                <ListingCard key={p._id} product={p} />
              ))
            ) : (
              <p className="listing-empty">No products yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="promo-cards-section" aria-label="Featured promotions" data-aos="fade-up" data-aos-duration="600">
        <div className="promo-cards-inner">
          <div className="promo-cards-grid">
            {collections.length >= 4
              ? collections.slice(0, 4).map((c, i) => (
                  <Link key={c._id} to={`/collections/${c._id}/${c.urlHandle}`} className="banner-card">
                    <div className="promo-card-bg">
                      <img src={COLLECTION_IMGS[i]} alt="" aria-hidden="true" />
                    </div>
                    <div className={`promo-card-overlay promo-overlay-${['green', 'yellow', 'pink', 'blue'][i]}`}>
                      <span className="promo-card-badge">Collection</span>
                      <h3 className="promo-card-title">{c.title}</h3>
                      <p className="promo-card-shipping">Free worldwide shipping on orders over $200</p>
                      <span className="promo-card-cta">Explore Collection <span className="promo-card-arrow"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span></span>
                    </div>
                  </Link>
                ))
              : [1, 2, 3, 4].map((i) => (
                  <Link key={i} to="/category" className="banner-card">
                    <div className="promo-card-bg">
                      <img src={COLLECTION_IMGS[i - 1]} alt="" aria-hidden="true" />
                    </div>
                    <div className={`promo-card-overlay promo-overlay-${['green', 'yellow', 'pink', 'blue'][i - 1]}`}>
                      <span className="promo-card-badge">Exclusive Offer</span>
                      <h3 className="promo-card-title">Collection {i}</h3>
                      <p className="promo-card-shipping">Free worldwide shipping</p>
                      <span className="promo-card-cta">Explore <span className="promo-card-arrow"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span></span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="day-deals-section" aria-labelledby="day-deals-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="day-deals-inner">
          <h2 id="day-deals-heading">Watch Deals of the Day</h2>
          <div className="day-deals-slider">
            <div className="day-deals-track">
              {dayDealsProducts.length > 0
                ? dayDealsProducts.map((p, i) => (
                    <DayDealCard key={p._id} product={p} onAddToCart={handleAddToCart} slideIndex={i} />
                  ))
                : (
                  <div className="day-deals-slide">
                    <Link to="/category" className="day-deal-card">
                      <div className="day-deal-image"><img src="/assets/img/watch-6.jpg" alt="Shop" width={280} height={200} /></div>
                      <div className="day-deal-content">
                        <span className="day-deal-badge">Shop Now</span>
                        <h3 className="day-deal-title">Browse our collection</h3>
                        <span className="day-deal-cta">View Products</span>
                      </div>
                    </Link>
                  </div>
                )}
            </div>
            <div className="day-deals-dots">
              <button type="button" className="day-deals-dot active" data-slide="0" aria-label="Slide 1"></button>
              <button type="button" className="day-deals-dot" data-slide="1" aria-label="Slide 2"></button>
              <button type="button" className="day-deals-dot" data-slide="2" aria-label="Slide 3"></button>
            </div>
          </div>
        </div>
      </section>

      <section className="category-promo-section" aria-label="Category promotions" data-aos="fade-up" data-aos-duration="600">
        <div className="category-promo-inner">
          <div className="category-promo-grid">
            <Link to="/category" className="category-promo-card">
              <div className="category-promo-bg">
                <img src="/assets/img/category-13.webp" alt="" aria-hidden="true" />
                <div className="category-promo-overlay"></div>
              </div>
              <div className="category-promo-content">
                <span className="category-promo-badge badge-purple">Starting From $299</span>
                <h3 className="category-promo-title">Luxury Watches</h3>
                <p className="category-promo-desc">Timeless craftsmanship and elegant designs made for those who value precision and style.</p>
                <span className="category-promo-cta">Explore Collection <span className="category-promo-arrow"></span></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-trust-section" aria-label="Store features and benefits" data-aos="fade-up" data-aos-duration="600">
        <div className="features-trust-inner">
          <div className="features-trust-grid">
            <div className="features-trust-card features-trust-card-teal">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 className="features-trust-title">Free Worldwide Shipping</h3>
              <p className="features-trust-desc">Enjoy fast and secure delivery on all watch orders with no extra shipping charges.</p>
            </div>
            <div className="features-trust-card features-trust-card-yellow">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="features-trust-title">2 Year Warranty</h3>
              <p className="features-trust-desc">Every watch comes with an official warranty covering manufacturing defects and quality assurance.</p>
            </div>
            <div className="features-trust-card features-trust-card-orange">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="features-trust-title">Easy 30-Day Returns</h3>
              <p className="features-trust-desc">If your watch isn&apos;t the perfect fit, return it within 30 days with our hassle-free return policy.</p>
            </div>
            <div className="features-trust-card features-trust-card-green">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="features-trust-title">100% Secure Checkout</h3>
              <p className="features-trust-desc">Shop with confidence using encrypted payments and trusted payment gateways.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-tech-section" aria-labelledby="featured-tech-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="featured-tech-inner">
          <h2 id="featured-tech-heading" className="featured-tech-title">Precision craftsmanship for every moment.</h2>
          <div className="featured-tech-grid">
            <div className="featured-tech-col featured-tech-col-left">
              {featuredProducts[0] && <FeaturedTechCard product={featuredProducts[0]} />}
              {featuredProducts[1] && <FeaturedTechCard product={featuredProducts[1]} />}
            </div>
            <div className="featured-tech-col featured-tech-col-center">
              {featuredProducts[2] ? (
                <Link to={`/products/${featuredProducts[2]._id}`} className="featured-tech-card featured-tech-featured">
                  <div className="featured-tech-featured-img">
                    <img src={(featuredProducts[2].imageUrls && featuredProducts[2].imageUrls[0]) || '/assets/img/watch-5.jpg'} alt={featuredProducts[2].title} width={280} height={280} />
                  </div>
                  <h3 className="featured-tech-name">{featuredProducts[2].title}</h3>
                  <div className="featured-tech-price">
                    <span className="featured-tech-current">{formatINR(featuredProducts[2].price)}</span>
                    {featuredProducts[2].compareAtPrice && featuredProducts[2].compareAtPrice > featuredProducts[2].price && (
                      <span className="featured-tech-old">{formatINR(featuredProducts[2].compareAtPrice)}</span>
                    )}
                  </div>
                </Link>
              ) : (
                <Link to="/category" className="featured-tech-card featured-tech-featured">
                  <div className="featured-tech-featured-img">
                    <img src="/assets/img/watch-5.jpg" alt="Featured" width={280} height={280} />
                  </div>
                  <h3 className="featured-tech-name">Shop Collection</h3>
                  <div className="featured-tech-price"><span className="featured-tech-current">View All</span></div>
                </Link>
              )}
            </div>
            <div className="featured-tech-col featured-tech-col-right">
              {featuredProducts[3] && <FeaturedTechCard product={featuredProducts[3]} />}
              {featuredProducts[4] && <FeaturedTechCard product={featuredProducts[4]} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StorefrontApp;
