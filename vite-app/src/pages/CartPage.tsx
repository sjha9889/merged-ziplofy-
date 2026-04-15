import { Link } from 'react-router-dom'

export function CartPage() {
  return (
    <>
      <main className="cart-page">
        <div className="cart-inner">
          <nav className="cart-breadcrumb" aria-label="Breadcrumb">
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
            <span className="cart-breadcrumb-sep">•</span>
            <span className="cart-breadcrumb-current">Cart</span>
          </nav>

          <div className="cart-header-row">
            <h1 className="cart-title">
              Cart <span className="cart-item-count" id="cart-item-count">(3 item)</span>
            </h1>
            <button type="button" className="cart-remove-all" id="cart-remove-all" aria-label="Remove all items">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove All
            </button>
          </div>

          <div className="cart-grid">
            <div className="cart-table-wrap">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="cart-tbody">
                  <tr className="cart-row" data-price="27.49" data-old="29.95">
                    <td data-label="Product">
                      <div className="cart-item-product">
                        <img src="/assets/img/watch-1.jpg" alt="Product" className="cart-item-img" />
                        <div className="cart-item-details">
                          <div className="cart-item-name">
                            <Link to="/product">Daniel Wellington Minimalist Silver Dial Watch</Link>
                          </div>
                          <div className="cart-item-options">
                            Color: Black, Size: <span className="cart-item-size">250 ML</span>
                          </div>
                          <div className="cart-item-stock">Available: 2</div>
                          <div className="cart-item-rating">
                            ★★★★★ <span className="cart-item-reviews">(118)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">
                      <div className="cart-price-cell">
                        <span className="cart-price-current">$27.49</span>
                        <span className="cart-price-old">$29.95</span>
                      </div>
                    </td>
                    <td data-label="Quantity">
                      <div className="cart-qty-wrap">
                        <button type="button" className="cart-qty-btn" data-action="minus" aria-label="Decrease">
                          −
                        </button>
                        <input
                          type="number"
                          className="cart-qty-input"
                          defaultValue={1}
                          min={1}
                          max={99}
                          readOnly
                          aria-label="Quantity"
                        />
                        <button type="button" className="cart-qty-btn" data-action="plus" aria-label="Increase">
                          +
                        </button>
                      </div>
                    </td>
                    <td data-label="Total Price">
                      <span className="cart-row-total">$27.49</span>
                    </td>
                    <td data-label="Action">
                      <div className="cart-row-actions">
                        <button type="button" className="cart-action-btn cart-wishlist" aria-label="Add to wishlist">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        <button type="button" className="cart-action-btn cart-delete" aria-label="Delete item">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <aside className="cart-summary-card">
              <div className="cart-shipping-banner">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1h-1m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
                Spend $60.00 for Free Shipping
              </div>
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-coupon-wrap">
                <input type="text" className="cart-coupon-input" placeholder="Coupon Code" id="cart-coupon-input" />
                <button type="button" className="cart-coupon-btn" id="cart-apply-coupon">
                  Apply
                </button>
              </div>
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Sub-Total</span>
                  <span id="cart-subtotal">$62.48</span>
                </div>
                <div className="cart-summary-row">
                  <span>VAT (40%)</span>
                  <span id="cart-vat">$25.00</span>
                </div>
                <div className="cart-summary-divider"></div>
                <div className="cart-summary-row cart-summary-total">
                  <span>Total</span>
                  <span id="cart-total">$87.48</span>
                </div>
              </div>
              <label className="cart-terms-checkbox">
                <input type="checkbox" name="terms" id="cart-terms" />
                <span>
                  I agree with the <a href="#">Terms</a> and <a href="#">Conditions</a>
                </span>
              </label>
              <Link to="/checkout" className="cart-checkout-btn">
                Proceed to checkout
              </Link>
              <Link to="/category" className="cart-continue">
                Continue Shopping →
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <section className="trust-features-section" aria-labelledby="trust-features-heading">
        <div className="trust-features-bg">
          <div className="trust-features-header">
            <h2 id="trust-features-heading" className="trust-features-title">
              Quality is our priority
            </h2>
            <p className="trust-features-subtitle">Because you deserve nothing less than the best.</p>
          </div>
          <div className="trust-features-grid">
            <article className="trust-feature-card">
              <div className="trust-feature-icon">
                <i className="bi bi-truck" aria-hidden="true"></i>
              </div>
              <h3 className="trust-feature-title">Free Shipping</h3>
              <p className="trust-feature-desc">Enjoy the convenience of free shipping on every order.</p>
            </article>
            <article className="trust-feature-card">
              <div className="trust-feature-icon">
                <i className="bi bi-headset" aria-hidden="true"></i>
              </div>
              <h3 className="trust-feature-title">24x7 Support</h3>
              <p className="trust-feature-desc">Round-the-clock assistance whenever you need help.</p>
            </article>
            <article className="trust-feature-card">
              <div className="trust-feature-icon">
                <i className="bi bi-box-seam" aria-hidden="true"></i>
              </div>
              <h3 className="trust-feature-title">30 Days Return</h3>
              <p className="trust-feature-desc">Return any product within 30 days with no hassle.</p>
            </article>
            <article className="trust-feature-card">
              <div className="trust-feature-icon">
                <i className="bi bi-shield-check" aria-hidden="true"></i>
              </div>
              <h3 className="trust-feature-title">Secure Payment</h3>
              <p className="trust-feature-desc">Your payments are protected with secure checkout systems.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="product-carousel-section" aria-labelledby="product-carousel-heading">
        <div className="product-carousel-inner">
          <div className="product-carousel-header">
            <h2 id="product-carousel-heading" className="product-carousel-title">
              New Branded Watches
            </h2>
            <div className="product-carousel-nav">
              <button type="button" className="product-carousel-btn product-carousel-prev" aria-label="Previous">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" className="product-carousel-btn product-carousel-next" aria-label="Next">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="product-carousel-wrap">
            <div className="product-carousel-track" id="product-carousel-track">
              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-6.jpg" alt="Apple Style Smart Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Apple Style Smartwatch AMOLED Fitness Tracker</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(428)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$229.00</span>
                    <span className="product-carousel-price-old">$299.00</span>
                    <span className="product-carousel-discount">24% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>

              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-5.jpg" alt="Casio G-Shock Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Casio G-Shock Digital Waterproof Sport Watch</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(392)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$119.00</span>
                    <span className="product-carousel-price-old">$159.00</span>
                    <span className="product-carousel-discount">25% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>

              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-4.jpg" alt="Luxury Gold Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Rolex Style Gold Plated Luxury Men&apos;s Watch</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(341)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$399.00</span>
                    <span className="product-carousel-price-old">$499.00</span>
                    <span className="product-carousel-discount">20% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>

              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-3.jpg" alt="Minimalist Silver Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Daniel Wellington Minimalist Silver Dial Watch</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(263)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$129.99</span>
                    <span className="product-carousel-price-old">$169.99</span>
                    <span className="product-carousel-discount">23% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>

              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-2.jpg" alt="Fossil Leather Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Fossil Grant Classic Brown Leather Strap Watch</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(198)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$149.99</span>
                    <span className="product-carousel-price-old">$199.99</span>
                    <span className="product-carousel-discount">25% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>

              <article className="product-carousel-card">
                <Link to="/product" className="product-carousel-card-link">
                  <div className="product-carousel-img-wrap">
                    <img src="/assets/img/watch-1.jpg" alt="Titan Chronograph Watch" className="product-carousel-img" />
                  </div>
                  <h3 className="product-carousel-card-title">Titan Elite Chronograph Stainless Steel Watch</h3>
                  <div className="product-carousel-rating">
                    ★★★★★ <span className="product-carousel-reviews">(312)</span>
                  </div>
                  <div className="product-carousel-price-row">
                    <span className="product-carousel-price-current">$189.00</span>
                    <span className="product-carousel-price-old">$249.00</span>
                    <span className="product-carousel-discount">20% OFF</span>
                  </div>
                </Link>
                <div className="product-carousel-footer">
                  <button type="button" className="product-carousel-wishlist" aria-label="Add to wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="product-carousel-addcart btn-add-cart">
                    Add to Cart
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

