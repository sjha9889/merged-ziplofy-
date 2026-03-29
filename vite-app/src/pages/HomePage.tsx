import { Link } from 'react-router-dom'

export function HomePage() {
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
                  <p>
                    Discover premium watches that combine timeless design with modern technology. Elevate your style with Chronova&apos;s
                    finest collection.
                  </p>
                  <Link to="/category" className="hero-cta">
                    Shop Now
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
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
                  <Link to="/category" className="hero-cta">
                    Explore Now
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
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
                  <Link to="/category" className="hero-cta">
                    Shop Smart
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="hero-slide">
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-label">Best Sellers</span>
                  <span className="hero-badge">Top Rated</span>
                  <h1>Classic Leather &amp; Stainless Steel Designs.</h1>
                  <p>
                    From boardroom to weekend, our classic collection delivers sophistication and reliability you can count on.
                  </p>
                  <Link to="/category" className="hero-cta">
                    View Collection
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <button type="button" className="hero-prev" id="hero-prev" aria-label="Previous slide">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button type="button" className="hero-next" id="hero-next" aria-label="Next slide">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
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
          <h2 id="categories-heading" className="sr-only">
            Product Categories
          </h2>
          <div className="categories-grid">
            <a href="#" className="category-card">
              <img src="/assets/img/category-1.jpg" alt="Drone" width="60" height="60" />
              <span>Luxury Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-2.jpg" alt="Smartphone" width="60" height="60" />
              <span>Smart Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-3.jpg" alt="Laptop" width="60" height="60" />
              <span>Automatic Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-4.jpg" alt="Power bank" width="60" height="60" />
              <span>Quartz Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-5.jpg" alt="Apple product" width="60" height="60" />
              <span>Designer Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-6.jpg" alt="Camera" width="60" height="60" />
              <span>Sports Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-7.jpg" alt="Gaming console" width="60" height="60" />
              <span>Minimalist Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-8.jpg" alt="Washing machine" width="60" height="60" />
              <span>Premium Chronographs</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-9.jpg" alt="Television" width="60" height="60" />
              <span>Classic Leather Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-10.jpg" alt="Game controller" width="60" height="60" />
              <span>Stainless Steel Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-11.jpg" alt="Storage device" width="60" height="60" />
              <span>Limited Edition Watches</span>
            </a>
            <a href="#" className="category-card">
              <img src="/assets/img/category-12.jpg" alt="Headphones" width="60" height="60" />
              <span>Gift Collection</span>
            </a>
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
              <div className="deals-countdown" id="deals-countdown">
                Ends in: 276 : 10 : 44 : 39
              </div>
              <div className="deals-filters">
                <button type="button" className="deals-filter active" data-filter="all">
                  View All
                </button>
                <button type="button" className="deals-filter" data-filter="phones">
                  Smart Phones
                </button>
                <button type="button" className="deals-filter" data-filter="camera">
                  Camera
                </button>
                <button type="button" className="deals-filter" data-filter="headphone">
                  Headphone
                </button>
              </div>
            </div>
          </header>

          <div className="deals-grid">
            <article className="product-card">
              <Link to="/product" className="product-card-link">
                <div className="product-card-image">
                  <img src="/assets/img/watch-1.jpg" alt="Apex Chronograph Watch" width="200" height="180" />
                  <div className="product-card-icons">
                    <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Compare">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Quick view">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-timer" id="timer-1">
                  276 Days : 10 Hours : 44 Mins : 39 Secs
                </div>
                <h3 className="product-title">Apex Chronograph Watch</h3>
                <div className="product-rating">
                  ⭐⭐⭐⭐☆ <span>(189)</span>
                </div>
                <div className="product-price">
                  <span className="price-current">$127.49</span>
                  <span className="price-old">$229.99</span>
                </div>
              </Link>
              <div className="product-actions">
                <button type="button" className="btn-wishlist" aria-label="Add to wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button type="button" className="btn-add-cart">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </article>

            <article className="product-card">
              <Link to="/product" className="product-card-link">
                <div className="product-card-image">
                  <img src="/assets/img/watch-2.jpg" alt="Lunar Automatic Watch" width="200" height="180" />
                  <div className="product-card-icons">
                    <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Compare">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Quick view">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-timer" id="timer-2">
                  276 Days : 10 Hours : 44 Mins : 39 Secs
                </div>
                <h3 className="product-title">Lunar Automatic Watch</h3>
                <div className="product-rating">
                  ⭐⭐⭐⭐☆ <span>(256)</span>
                </div>
                <div className="product-price">
                  <span className="price-current">$299.99</span>
                  <span className="price-old">$499.99</span>
                </div>
              </Link>
              <div className="product-actions">
                <button type="button" className="btn-wishlist" aria-label="Add to wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button type="button" className="btn-add-cart">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </article>

            <article className="product-card">
              <Link to="/product" className="product-card-link">
                <div className="product-card-image">
                  <img src="/assets/img/watch-3.jpg" alt="Aurora Minimal Watch" width="200" height="180" />
                  <div className="product-card-icons">
                    <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Compare">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Quick view">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-timer" id="timer-3">
                  276 Days : 10 Hours : 44 Mins : 39 Secs
                </div>
                <h3 className="product-title">Aurora Minimal Watch</h3>
                <div className="product-rating">
                  ⭐⭐⭐⭐☆ <span>(142)</span>
                </div>
                <div className="product-price">
                  <span className="price-current">$34.99</span>
                  <span className="price-old">$59.99</span>
                </div>
              </Link>
              <div className="product-actions">
                <button type="button" className="btn-wishlist" aria-label="Add to wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button type="button" className="btn-add-cart">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </article>

            <article className="product-card">
              <Link to="/product" className="product-card-link">
                <div className="product-card-image">
                  <img src="/assets/img/watch-4.jpg" alt="Velocity Sport Watch" width="200" height="180" />
                  <div className="product-card-icons">
                    <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Compare">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Quick view">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-timer" id="timer-4">
                  276 Days : 10 Hours : 44 Mins : 39 Secs
                </div>
                <h3 className="product-title">Velocity Sport Watch</h3>
                <div className="product-rating">
                  ⭐⭐⭐⭐☆ <span>(312)</span>
                </div>
                <div className="product-price">
                  <span className="price-current">$89.99</span>
                  <span className="price-old">$149.99</span>
                </div>
              </Link>
              <div className="product-actions">
                <button type="button" className="btn-wishlist" aria-label="Add to wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button type="button" className="btn-add-cart">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </article>

            <article className="product-card">
              <Link to="/product" className="product-card-link">
                <div className="product-card-image">
                  <img src="/assets/img/watch-5.jpg" alt="Imperial Steel Watch" width="200" height="180" />
                  <div className="product-card-icons">
                    <button type="button" className="product-icon-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Compare">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button type="button" className="product-icon-btn" aria-label="Quick view">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-timer" id="timer-5">
                  276 Days : 10 Hours : 44 Mins : 39 Secs
                </div>
                <h3 className="product-title">Imperial Steel Watch</h3>
                <div className="product-rating">
                  ⭐⭐⭐⭐☆ <span>(98)</span>
                </div>
                <div className="product-price">
                  <span className="price-current">$45.99</span>
                  <span className="price-old">$79.99</span>
                </div>
              </Link>
              <div className="product-actions">
                <button type="button" className="btn-wishlist" aria-label="Add to wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button type="button" className="btn-add-cart">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="promo-wrap" aria-labelledby="promo-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="promo-inner">
          <div className="promo-banner">
            <div className="promo-card">
              <h2 id="promo-heading">Hurry! Limited Deals</h2>
              <p className="promo-sub">Cases you love, prices you&apos;ll love more.</p>
              <div className="promo-countdown">
                <div className="countdown-block countdown-days">
                  <span className="countdown-label">Days</span>
                  <span className="countdown-value" id="promo-days">
                    276
                  </span>
                </div>
                <div className="countdown-block countdown-hours">
                  <span className="countdown-label">Hours</span>
                  <span className="countdown-value" id="promo-hours">
                    10
                  </span>
                </div>
                <div className="countdown-block countdown-mins">
                  <span className="countdown-label">Mins</span>
                  <span className="countdown-value" id="promo-mins">
                    34
                  </span>
                </div>
                <div className="countdown-block countdown-secs">
                  <span className="countdown-label">Secs</span>
                  <span className="countdown-value" id="promo-secs">
                    29
                  </span>
                </div>
              </div>
              <a href="#" className="promo-cta">
                Explore Watches
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          <div className="brand-logos">
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
            <span className="brand-logo" aria-hidden="true">
              Logoipsum
            </span>
          </div>
        </div>
      </section>

      <section className="listing-section" aria-labelledby="listing-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="listing-inner">
          <header className="listing-header">
            <h2 id="listing-heading">Premium Watch Collection</h2>
            <a href="#" className="listing-view-all">
              View All
            </a>
          </header>
          <div className="listing-grid">
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-12.jpg" alt="Apex Chronograph Watch" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">18% OF</span>
                <h3 className="listing-title">Apex Chronograph Watch</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(189)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$189.99</span>
                  <span className="listing-price-old">$229.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-11.jpg" alt="Lunar Automatic Watch" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Lunar Automatic Watch</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(124)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$89.99</span>
                  <span className="listing-price-old">$99.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-6.jpg" alt="Aurora Minimal Watch" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Aurora Minimal Watch</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(256)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$149.99</span>
                  <span className="listing-price-old">$169.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-3.jpg" alt="Velocity Sport Watch" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Velocity Sport Watch</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(98)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$59.99</span>
                  <span className="listing-price-old">$69.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-9.jpg" alt="Titan Leather Classic" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Titan Leather Classic</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(167)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$199.99</span>
                  <span className="listing-price-old">$229.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-1.jpg" alt="Navigator GMT Watch" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Navigator GMT Watch</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(312)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$79.99</span>
                  <span className="listing-price-old">$89.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-4.jpg" alt="Midnight Black Edition" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">Midnight Black Edition</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(89)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$129.99</span>
                  <span className="listing-price-old">$149.99</span>
                </div>
              </div>
            </Link>
            <Link to="/category" className="listing-card">
              <div className="listing-image">
                <img src="/assets/img/category-7.jpg" alt="PulseWave Bluetooth Speaker" width="110" height="110" />
              </div>
              <div className="listing-content">
                <span className="listing-badge">15% OFF</span>
                <h3 className="listing-title">PulseWave Bluetooth Speaker</h3>
                <div className="listing-rating">
                  ⭐⭐⭐⭐☆ <span>(203)</span>
                </div>
                <div className="listing-price">
                  <span className="listing-price-current">$44.99</span>
                  <span className="listing-price-old">$49.99</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="promo-cards-section" aria-label="Featured promotions" data-aos="fade-up" data-aos-duration="600">
        <div className="promo-cards-inner">
          <div className="promo-cards-grid">
            <Link to="/category" className="banner-card">
              <div className="promo-card-bg">
                <img src="/assets/img/collection-1.webp" alt="" aria-hidden="true" />
              </div>
              <div className="promo-card-overlay promo-overlay-green">
                <span className="promo-card-badge">Exclusive 25% Offer</span>
                <h3 className="promo-card-title">Luxury Chronograph Collection</h3>
                <p className="promo-card-shipping">Free worldwide shipping on orders over $200</p>
                <span className="promo-card-cta">
                  Explore Collection
                  <span className="promo-card-arrow">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
            <Link to="/category" className="banner-card">
              <div className="promo-card-bg">
                <img src="/assets/img/collection-6.webp" alt="" aria-hidden="true" />
              </div>
              <div className="promo-card-overlay promo-overlay-yellow">
                <span className="promo-card-badge">Limited Time Deal</span>
                <h3 className="promo-card-title">Automatic Heritage Watches</h3>
                <p className="promo-card-shipping">Complimentary shipping on orders above $250</p>
                <span className="promo-card-cta">
                  Discover Watches
                  <span className="promo-card-arrow">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
            <Link to="/category" className="banner-card">
              <div className="promo-card-bg">
                <img src="/assets/img/collection-8.webp" alt="" aria-hidden="true" />
              </div>
              <div className="promo-card-overlay promo-overlay-pink">
                <span className="promo-card-badge">New Arrival</span>
                <h3 className="promo-card-title">Minimalist Steel Watches</h3>
                <p className="promo-card-shipping">Free express delivery on orders above $180</p>
                <span className="promo-card-cta">
                  View New Arrivals
                  <span className="promo-card-arrow">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
            <Link to="/category" className="banner-card">
              <div className="promo-card-bg">
                <img src="/assets/img/collection-5.webp" alt="" aria-hidden="true" />
              </div>
              <div className="promo-card-overlay promo-overlay-blue">
                <span className="promo-card-badge">Special Edition</span>
                <h3 className="promo-card-title">Luxury Limited Edition Watches</h3>
                <p className="promo-card-shipping">Free shipping on premium orders above $300</p>
                <span className="promo-card-cta">
                  Shop Limited Edition
                  <span className="promo-card-arrow">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="day-deals-section" aria-labelledby="day-deals-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="day-deals-inner">
          <h2 id="day-deals-heading">Watch Deals of the Day</h2>
          <div className="day-deals-slider">
            <div className="day-deals-track">
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="0">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-6.jpg" alt="Apex Chronograph Watch" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">18% OFF</span>
                    <h3 className="day-deal-title">Apex Chronograph Watch</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(189)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#7C3AED' }}></span>
                      <span className="color-dot" style={{ background: '#6EE7B7' }}></span>
                      <span className="color-dot" style={{ background: '#FDE68A' }}></span>
                      <span className="color-dot" style={{ background: '#93C5FD' }}></span>
                      <span className="color-dot" style={{ background: '#3B82F6' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-1">
                          276
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-1">
                          10
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-1">
                          12
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-1">
                          58
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 4</span>
                      <div className="stock-bar">
                        <div className="stock-fill"></div>
                      </div>
                      <span>Available: 200</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$27.49</span>
                        <span className="day-deal-old">$29.99</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="1">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-7.webp" alt="Lunar Automatic Watch" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">15% OFF</span>
                    <h3 className="day-deal-title">Lunar Automatic Watch</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(256)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#1F2937' }}></span>
                      <span className="color-dot" style={{ background: '#F59E0B' }}></span>
                      <span className="color-dot" style={{ background: '#EC4899' }}></span>
                      <span className="color-dot" style={{ background: '#3B82F6' }}></span>
                      <span className="color-dot" style={{ background: '#10B981' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-2">
                          0
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-2">
                          00
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-2">
                          00
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-2">
                          00
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 12</span>
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: '6%' }}></div>
                      </div>
                      <span>Available: 188</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$999.00</span>
                        <span className="day-deal-old">$1,199.00</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="2">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-8.webp" alt="Aurora Minimal Watch" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">15% OFF</span>
                    <h3 className="day-deal-title">Aurora Minimal Watch</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(89)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#1F2937' }}></span>
                      <span className="color-dot" style={{ background: '#6B7280' }}></span>
                      <span className="color-dot" style={{ background: '#FDE68A' }}></span>
                      <span className="color-dot" style={{ background: '#EC4899' }}></span>
                      <span className="color-dot" style={{ background: '#3B82F6' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-3">
                          276
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-3">
                          10
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-3">
                          34
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-3">
                          29
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 8</span>
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: '4%' }}></div>
                      </div>
                      <span>Available: 192</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$449.99</span>
                        <span className="day-deal-old">$529.99</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="3">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-9.webp" alt="Wireless Headphones" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">15% OFF</span>
                    <h3 className="day-deal-title">Wireless Headphones</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(312)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#1F2937' }}></span>
                      <span className="color-dot" style={{ background: '#F59E0B' }}></span>
                      <span className="color-dot" style={{ background: '#EC4899' }}></span>
                      <span className="color-dot" style={{ background: '#6EE7B7' }}></span>
                      <span className="color-dot" style={{ background: '#3B82F6' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-4">
                          276
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-4">
                          10
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-4">
                          45
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-4">
                          12
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 24</span>
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: '12%' }}></div>
                      </div>
                      <span>Available: 176</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$89.99</span>
                        <span className="day-deal-old">$119.99</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="4">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-10.jpg" alt="Pro Gaming Controller" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">15% OFF</span>
                    <h3 className="day-deal-title">Pro Gaming Controller</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(156)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#1F2937' }}></span>
                      <span className="color-dot" style={{ background: '#EF4444' }}></span>
                      <span className="color-dot" style={{ background: '#3B82F6' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-5">
                          276
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-5">
                          10
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-5">
                          22
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-5">
                          41
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 15</span>
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: '7.5%' }}></div>
                      </div>
                      <span>Available: 185</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$59.99</span>
                        <span className="day-deal-old">$69.99</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="day-deals-slide">
                <Link to="/category" className="day-deal-card" data-slide="5">
                  <div className="day-deal-image">
                    <img src="/assets/img/watch-3.jpg" alt="Smart Speaker Pro" width="280" height="200" />
                  </div>
                  <div className="day-deal-content">
                    <span className="day-deal-badge">15% OFF</span>
                    <h3 className="day-deal-title">Smart Speaker Pro</h3>
                    <div className="day-deal-rating">
                      ⭐⭐⭐⭐½ <span>(203)</span>
                    </div>
                    <div className="day-deal-colors">
                      <span className="color-dot" style={{ background: '#1F2937' }}></span>
                      <span className="color-dot" style={{ background: '#FDE68A' }}></span>
                      <span className="color-dot" style={{ background: '#EC4899' }}></span>
                    </div>
                    <div className="day-deal-timer">
                      <div className="timer-box">
                        <span className="timer-value" id="dod-days-6">
                          276
                        </span>
                        <span className="timer-label">Days</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-hours-6">
                          10
                        </span>
                        <span className="timer-label">Hours</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-mins-6">
                          18
                        </span>
                        <span className="timer-label">Minutes</span>
                      </div>
                      <div className="timer-box">
                        <span className="timer-value" id="dod-secs-6">
                          55
                        </span>
                        <span className="timer-label">Seconds</span>
                      </div>
                    </div>
                    <div className="day-deal-stock">
                      <span>Sold: 9</span>
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: '4.5%' }}></div>
                      </div>
                      <span>Available: 191</span>
                    </div>
                    <div className="day-deal-bottom">
                      <div className="day-deal-price">
                        <span className="day-deal-current">$129.99</span>
                        <span className="day-deal-old">$149.99</span>
                      </div>
                      <span className="day-deal-cta">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
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
            <a href="#" className="category-promo-card">
              <div className="category-promo-bg">
                <img src="/assets/img/category-13.webp" alt="" aria-hidden="true" />
                <div className="category-promo-overlay"></div>
              </div>
              <div className="category-promo-content">
                <span className="category-promo-badge badge-purple">Starting From $299</span>
                <h3 className="category-promo-title">Luxury Watches</h3>
                <p className="category-promo-desc">
                  Timeless craftsmanship and elegant designs made for those who value precision and style.
                </p>
                <span className="category-promo-cta">
                  Explore Collection <span className="category-promo-arrow"></span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="features-trust-section" aria-label="Store features and benefits" data-aos="fade-up" data-aos-duration="600">
        <div className="features-trust-inner">
          <div className="features-trust-grid">
            <div className="features-trust-card features-trust-card-teal">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="features-trust-title">Free Worldwide Shipping</h3>
              <p className="features-trust-desc">Enjoy fast and secure delivery on all watch orders with no extra shipping charges.</p>
            </div>
            <div className="features-trust-card features-trust-card-yellow">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="features-trust-title">2 Year Warranty</h3>
              <p className="features-trust-desc">Every watch comes with an official warranty covering manufacturing defects and quality assurance.</p>
            </div>
            <div className="features-trust-card features-trust-card-orange">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="features-trust-title">Easy 30-Day Returns</h3>
              <p className="features-trust-desc">If your watch isn&apos;t the perfect fit, return it within 30 days with our hassle-free return policy.</p>
            </div>
            <div className="features-trust-card features-trust-card-green">
              <div className="features-trust-icon-wrap">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="features-trust-title">100% Secure Checkout</h3>
              <p className="features-trust-desc">Shop with confidence using encrypted payments and trusted payment gateways.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-tech-section" aria-labelledby="featured-tech-heading" data-aos="fade-up" data-aos-duration="600">
        <div className="featured-tech-inner">
          <h2 id="featured-tech-heading" className="featured-tech-title">
            Precision craftsmanship for every moment.
          </h2>
          <div className="featured-tech-grid">
            <div className="featured-tech-col featured-tech-col-left">
              <Link to="/category" className="featured-tech-card featured-tech-side">
                <div className="featured-tech-card-img">
                  <img src="/assets/img/watch-1.jpg" alt="Apex Chronograph" width="120" height="90" />
                </div>
                <div className="featured-tech-card-content">
                  <span className="featured-tech-badge">20% OFF</span>
                  <h3 className="featured-tech-name">Apex Chronograph</h3>
                  <div className="featured-tech-rating">
                    ⭐⭐⭐⭐½ <span>(189)</span>
                  </div>
                  <div className="featured-tech-price">
                    <span className="featured-tech-current">$27.49</span>
                    <span className="featured-tech-old">$29.99</span>
                  </div>
                </div>
              </Link>
              <Link to="/category" className="featured-tech-card featured-tech-side">
                <div className="featured-tech-card-img">
                  <img src="/assets/img/watch-3.jpg" alt="Aurora Minimal" width="120" height="90" />
                </div>
                <div className="featured-tech-card-content">
                  <span className="featured-tech-badge">15% OFF</span>
                  <h3 className="featured-tech-name">Aurora Minimal</h3>
                  <div className="featured-tech-rating">
                    ⭐⭐⭐⭐½ <span>(256)</span>
                  </div>
                  <div className="featured-tech-price">
                    <span className="featured-tech-current">$27.49</span>
                    <span className="featured-tech-old">$29.99</span>
                  </div>
                </div>
              </Link>
            </div>
            <div className="featured-tech-col featured-tech-col-center">
              <Link to="/category" className="featured-tech-card featured-tech-featured">
                <div className="featured-tech-featured-img">
                  <img src="/assets/img/watch-5.jpg" alt="Royal Automatic Watch" width="280" height="280" />
                </div>
                <h3 className="featured-tech-name">Royal Automatic Watch</h3>
                <div className="featured-tech-price">
                  <span className="featured-tech-current">$28.56</span>
                  <span className="featured-tech-old">$29.56</span>
                </div>
              </Link>
            </div>
            <div className="featured-tech-col featured-tech-col-right">
              <Link to="/category" className="featured-tech-card featured-tech-side">
                <div className="featured-tech-card-img">
                  <img src="/assets/img/watch-7.webp" alt="Titan Sport Watch" width="120" height="90" />
                </div>
                <div className="featured-tech-card-content">
                  <span className="featured-tech-badge">15% OFF</span>
                  <h3 className="featured-tech-name">Titan Sport Watch</h3>
                  <div className="featured-tech-rating">
                    ⭐⭐⭐⭐½ <span>(189)</span>
                  </div>
                  <div className="featured-tech-price">
                    <span className="featured-tech-current">$27.49</span>
                    <span className="featured-tech-old">$39.99</span>
                  </div>
                </div>
              </Link>
              <Link to="/category" className="featured-tech-card featured-tech-side">
                <div className="featured-tech-card-img">
                  <img src="/assets/img/watch-9.webp" alt="Pulse Smart Watch" width="120" height="90" />
                </div>
                <div className="featured-tech-card-content">
                  <span className="featured-tech-badge">15% OFF</span>
                  <h3 className="featured-tech-name">Pulse Smart Watch</h3>
                  <div className="featured-tech-rating">
                    ⭐⭐⭐⭐½ <span>(312)</span>
                  </div>
                  <div className="featured-tech-price">
                    <span className="featured-tech-current">$27.49</span>
                    <span className="featured-tech-old">$39.99</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

