import { Link } from 'react-router-dom'

export function OrderSuccessPage() {
  return (
    <main>
      <section className="order-success-hero">
        <div className="order-success-inner">
          <nav className="order-success-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className="order-success-breadcrumb-sep">•</span>
            <span>Checkout</span>
          </nav>

          <div className="order-success-hero-illustration">
            <div className="order-success-hero-shape">
              <svg width="70" height="70" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="order-success-hero-dots" aria-hidden="true">
              <span className="dot-blue dot1"></span>
              <span className="dot-blue dot2"></span>
              <span className="dot-blue dot3"></span>
              <span className="dot-red dot4"></span>
              <span className="dot-leaf leaf1"></span>
              <span className="dot-leaf leaf2"></span>
            </div>
          </div>

          <h1 className="order-success-title">Thanks For Your Order</h1>
          <p className="order-success-text">
            We&apos;re excited to let you know that we&apos;ve received your order and it&apos;s now being processed.
          </p>
          <Link to="/" className="order-success-btn">
            Back To Home
          </Link>
        </div>
      </section>

      <section className="order-details-section">
        <div className="order-details-inner">
          <div className="order-details-grid">
            <div className="order-details-left">
              <div className="order-card order-card-details">
                <h2 className="order-card-title">Order Details</h2>
                <div className="order-detail-row">
                  <svg className="order-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8 4-8-4m0 0l8-4 8 4m0 6l-8 4-8-4m0 0l8-4 8 4"
                    />
                  </svg>
                  <div className="order-detail-content">
                    <span className="order-detail-label">Order ID</span>
                    <div className="order-detail-value">#65937</div>
                  </div>
                </div>
                <div className="order-detail-row">
                  <svg className="order-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8 4-8-4m0 0l8-4 8 4m0 6l-8 4-8-4m0 0l8-4 8 4"
                    />
                  </svg>
                  <div className="order-detail-content">
                    <span className="order-detail-label">Order status</span>
                    <div className="order-detail-value">
                      <span className="status-badge">Processing</span>
                    </div>
                  </div>
                </div>
                <div className="order-detail-row">
                  <svg className="order-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="order-detail-content">
                    <span className="order-detail-label">Amount Payable</span>
                    <div className="order-detail-value">
                      $40.00 <span className="paid">(Paid)</span>
                    </div>
                  </div>
                </div>
                <div className="order-detail-row">
                  <svg className="order-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="order-detail-content">
                    <span className="order-detail-label">Order Date:</span>
                    <div className="order-detail-value">11:12 AM, 24 April, 2027</div>
                  </div>
                </div>
              </div>

              <div className="order-card order-card-shipment">
                <h2 className="order-card-title">Shipment Address</h2>
                <div className="order-shipment-row">
                  <svg className="order-shipment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="order-shipment-value">Arlene McCoy</span>
                </div>
                <div className="order-shipment-row">
                  <svg className="order-shipment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="order-shipment-value">(555) 123-4567</span>
                </div>
                <div className="order-shipment-row">
                  <svg className="order-shipment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="order-shipment-value">
                    <a href="mailto:debbie.baker@example.com">debbie.baker@example.com</a>
                  </span>
                </div>
                <div className="order-shipment-row">
                  <svg className="order-shipment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="order-shipment-value">1234 Elm Street, Springfield, CA, 90210, United States</span>
                </div>
                <div className="order-shipment-row">
                  <svg className="order-shipment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span className="order-shipment-value">Free Delivery</span>
                </div>
              </div>

              <div className="order-card order-card-feedback">
                <h2 className="order-card-title">Give as a feedback</h2>
                <form className="order-feedback-form">
                  <textarea className="order-feedback-textarea" placeholder="Share your experience*" rows={4}></textarea>
                  <input type="text" className="order-feedback-input" placeholder="Name*" aria-label="Your name" />
                  <input type="email" className="order-feedback-input" placeholder="Email*" aria-label="Your email" />
                  <button type="submit" className="order-feedback-submit">
                    Send Now
                  </button>
                </form>
              </div>
            </div>

            <div className="order-details-right">
              <div className="order-card order-card-cart">
                <h2 className="order-card-title">Cart Items</h2>
                <ul className="order-cart-list">
                  <li className="order-cart-item">
                    <div className="order-cart-img-wrap">
                      <img src="/assets/img/watch-4.jpg" alt="Rolex Submariner" className="order-cart-img" />
                    </div>
                    <div className="order-cart-info">
                      <div className="order-cart-name">Rolex Submariner Stainless Steel Automatic Watch</div>
                      <div className="order-cart-qty">1 x 40mm Automatic</div>
                    </div>
                    <div className="order-cart-price">
                      <span className="order-cart-price-old">$12,499</span>
                      <span className="order-cart-price-new">$10,999</span>
                    </div>
                  </li>
                  <li className="order-cart-item">
                    <div className="order-cart-img-wrap">
                      <img src="/assets/img/watch-3.jpg" alt="Omega Speedmaster" className="order-cart-img" />
                    </div>
                    <div className="order-cart-info">
                      <div className="order-cart-name">Omega Speedmaster Moonwatch Professional</div>
                      <div className="order-cart-qty">1 x 42mm Sapphire Crystal</div>
                    </div>
                    <div className="order-cart-price">
                      <span className="order-cart-price-old">$8,499</span>
                      <span className="order-cart-price-new">$7,199</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="order-card order-card-summary">
                <h2 className="order-card-title">Order Summary</h2>
                <div className="order-summary-rows">
                  <div className="order-summary-row">
                    <span>Sub-Total</span>
                    <span>$20.00</span>
                  </div>
                  <div className="order-summary-row">
                    <span>VAT (40%)</span>
                    <span>$4.00</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Discount</span>
                    <span>-$4.00</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Shipment</span>
                    <span>$0.00</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="order-summary-divider"></div>
                <div className="order-summary-row order-summary-total">
                  <span>Total</span>
                  <span>$20.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="order-features">
        <div className="order-features-inner">
          <div className="order-features-grid">
            <div className="order-features-card">
              <div className="order-features-icon-wrap"></div>
              <h3 className="order-features-title">Free Shipping</h3>
              <p className="order-features-desc">Enjoy the Convenience of Free Shipping on Every Order</p>
            </div>
            <div className="order-features-card">
              <div className="order-features-icon-wrap"></div>
              <h3 className="order-features-title">24x7 Support</h3>
              <p className="order-features-desc">Round-the-Clock Assistance, Anytime You Need It</p>
            </div>
            <div className="order-features-card">
              <div className="order-features-icon-wrap"></div>
              <h3 className="order-features-title">30 Days Return</h3>
              <p className="order-features-desc">Your Satisfaction is Our Priority: Return Any Product Within 30 Days</p>
            </div>
            <div className="order-features-card">
              <div className="order-features-icon-wrap"></div>
              <h3 className="order-features-title">Secure Payment</h3>
              <p className="order-features-desc">Seamless Shopping Backed by Safe and Secure Payment Options</p>
            </div>
          </div>
        </div>
      </section>

      <section className="order-recently-viewed" aria-labelledby="order-rv-heading">
        <div className="order-rv-inner">
          <div className="order-rv-header">
            <h2 id="order-rv-heading" className="order-rv-title">
              Recently Viewed
            </h2>
            <div className="order-rv-nav">
              <button type="button" className="order-rv-btn order-rv-prev" aria-label="Previous">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" className="order-rv-btn order-rv-next" aria-label="Next">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="order-rv-wrap">
            <div className="order-rv-track" id="order-rv-track">
              <article className="order-rv-card">
                <span className="order-rv-new">NEW</span>
                <Link to="/product" className="order-rv-card-link">
                  <div className="order-rv-img-wrap">
                    <img src="/assets/img/watch-1.jpg" alt="Rolex Submariner" className="order-rv-img" />
                  </div>
                  <h3 className="order-rv-card-title">Rolex Submariner Stainless Steel Automatic Watch</h3>
                  <div className="order-rv-rating">
                    ★★★★★ <span className="order-rv-reviews">(248)</span>
                  </div>
                  <div className="order-rv-price-row">
                    <span className="order-rv-price-current">$10,999</span>
                    <span className="order-rv-price-old">$12,499</span>
                    <span className="order-rv-discount">12% OFF</span>
                  </div>
                </Link>
                <div className="order-rv-footer">
                  <button type="button" className="order-rv-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <Link to="/product" className="order-rv-addcart">
                    Add to Cart
                  </Link>
                </div>
              </article>

              <article className="order-rv-card">
                <span className="order-rv-new">NEW</span>
                <Link to="/product" className="order-rv-card-link">
                  <div className="order-rv-img-wrap">
                    <img src="/assets/img/watch-2.jpg" alt="Omega Speedmaster" className="order-rv-img" />
                  </div>
                  <h3 className="order-rv-card-title">Omega Speedmaster Moonwatch Professional</h3>
                  <div className="order-rv-rating">
                    ★★★★½ <span className="order-rv-reviews">(312)</span>
                  </div>
                  <div className="order-rv-price-row">
                    <span className="order-rv-price-current">$7,199</span>
                    <span className="order-rv-price-old">$8,499</span>
                    <span className="order-rv-discount">15% OFF</span>
                  </div>
                </Link>
                <div className="order-rv-footer">
                  <button type="button" className="order-rv-wishlist" aria-label="Add to wishlist">
                    ♡
                  </button>
                  <Link to="/product" className="order-rv-addcart">
                    Add to Cart
                  </Link>
                </div>
              </article>

              <article className="order-rv-card">
                <span className="order-rv-new">NEW</span>
                <Link to="/product" className="order-rv-card-link">
                  <div className="order-rv-img-wrap">
                    <img src="/assets/img/watch-3.jpg" alt="TAG Heuer Carrera" className="order-rv-img" />
                  </div>
                  <h3 className="order-rv-card-title">TAG Heuer Carrera Chronograph Automatic</h3>
                  <div className="order-rv-rating">
                    ★★★★★ <span className="order-rv-reviews">(174)</span>
                  </div>
                  <div className="order-rv-price-row">
                    <span className="order-rv-price-current">$5,999</span>
                    <span className="order-rv-price-old">$6,799</span>
                    <span className="order-rv-discount">11% OFF</span>
                  </div>
                </Link>
                <div className="order-rv-footer">
                  <button type="button" className="order-rv-wishlist">
                    ♡
                  </button>
                  <Link to="/product" className="order-rv-addcart">
                    Add to Cart
                  </Link>
                </div>
              </article>

              <article className="order-rv-card order-rv-card-hover-icons">
                <span className="order-rv-new">NEW</span>
                <Link to="/product" className="order-rv-card-link">
                  <div className="order-rv-img-wrap">
                    <img src="/assets/img/watch-4.jpg" alt="Audemars Piguet Royal Oak" className="order-rv-img" />
                  </div>
                  <h3 className="order-rv-card-title">Audemars Piguet Royal Oak Automatic Watch</h3>
                  <div className="order-rv-rating">
                    ★★★★★ <span className="order-rv-reviews">(198)</span>
                  </div>
                  <div className="order-rv-price-row">
                    <span className="order-rv-price-current">$18,499</span>
                    <span className="order-rv-price-old">$21,999</span>
                    <span className="order-rv-discount">16% OFF</span>
                  </div>
                </Link>
                <div className="order-rv-footer">
                  <button type="button" className="order-rv-wishlist">
                    ♡
                  </button>
                  <Link to="/product" className="order-rv-addcart">
                    Add to Cart
                  </Link>
                </div>
              </article>

              <article className="order-rv-card">
                <span className="order-rv-new">NEW</span>
                <Link to="/product" className="order-rv-card-link">
                  <div className="order-rv-img-wrap">
                    <img src="/assets/img/watch-5.jpg" alt="Patek Philippe Nautilus" className="order-rv-img" />
                  </div>
                  <h3 className="order-rv-card-title">Patek Philippe Nautilus Luxury Steel Watch</h3>
                  <div className="order-rv-rating">
                    ★★★★½ <span className="order-rv-reviews">(221)</span>
                  </div>
                  <div className="order-rv-price-row">
                    <span className="order-rv-price-current">$32,999</span>
                    <span className="order-rv-price-old">$36,999</span>
                    <span className="order-rv-discount">10% OFF</span>
                  </div>
                </Link>
                <div className="order-rv-footer">
                  <button type="button" className="order-rv-wishlist">
                    ♡
                  </button>
                  <Link to="/product" className="order-rv-addcart">
                    Add to Cart
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

