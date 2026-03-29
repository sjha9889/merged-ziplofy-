import { Link } from 'react-router-dom'

export function CheckoutPage() {
  return (
    <main className="checkout-page">
      <div className="checkout-inner">
        <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
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
          <span className="checkout-breadcrumb-sep">•</span>
          <span className="checkout-breadcrumb-current">Checkout</span>
        </nav>

        <div className="checkout-grid">
          <div className="checkout-left">
            <section className="checkout-card checkout-login">
              <h2 className="checkout-card-title">Already have an account ?</h2>
              <div className="checkout-login-row">
                <input type="text" className="checkout-input" placeholder="User Name" id="checkout-username" aria-label="User Name" />
                <input
                  type="password"
                  className="checkout-input"
                  placeholder="Password"
                  id="checkout-password"
                  aria-label="Password"
                />
              </div>
              <div className="checkout-login-footer">
                <span>
                  Don&apos;t have an account?{' '}
                  <a href="#" className="checkout-link" id="checkout-create-account">
                    Create Account
                  </a>
                </span>
                <button type="button" className="checkout-btn-primary" id="checkout-login-btn">
                  Login
                </button>
              </div>
            </section>

            <section className="checkout-card checkout-shipping">
              <h2 className="checkout-card-title">Shipping Address</h2>
              <form className="checkout-form" id="checkout-form" noValidate>
                <div className="checkout-form-row">
                  <input type="text" className="checkout-input" placeholder="First Name" name="firstName" required />
                  <input type="text" className="checkout-input" placeholder="Last Name" name="lastName" required />
                </div>
                <div className="checkout-form-row">
                  <input type="tel" className="checkout-input" placeholder="Phone Number" name="phone" required />
                  <input type="email" className="checkout-input" placeholder="Email Address (Optional)" name="email" />
                </div>
                <div className="checkout-form-row checkout-form-row-4">
                  <select className="checkout-input checkout-select" name="country" required aria-label="Country" defaultValue="">
                    <option value="">Country / Region</option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  <input type="text" className="checkout-input" placeholder="City" name="city" required />
                  <input type="text" className="checkout-input" placeholder="State" name="state" required />
                  <input type="text" className="checkout-input" placeholder="Zip Code" name="zip" required />
                </div>
                <div className="checkout-form-row">
                  <textarea
                    className="checkout-input checkout-textarea"
                    placeholder="Apartments, suit, unit, etc (Optional)"
                    name="address"
                    rows={4}
                  ></textarea>
                </div>

                <div className="checkout-delivery-section">
                  <h3 className="checkout-section-label">Delivery Time</h3>
                  <div className="checkout-delivery-options">
                    <label className="checkout-checkbox-label">
                      <input type="checkbox" name="deliveryTime" value="08-11" />
                      <span className="checkout-checkbox-custom"></span>
                      <span>08:00 AM - 11:00 AM</span>
                    </label>
                    <label className="checkout-checkbox-label">
                      <input type="checkbox" name="deliveryTime" value="11-02" />
                      <span className="checkout-checkbox-custom"></span>
                      <span>11:00 AM - 02:00 PM</span>
                    </label>
                    <label className="checkout-checkbox-label">
                      <input type="checkbox" name="deliveryTime" value="02-04" />
                      <span className="checkout-checkbox-custom"></span>
                      <span>02:00 PM - 04:00 PM</span>
                    </label>
                    <label className="checkout-checkbox-label">
                      <input type="checkbox" name="deliveryTime" value="04-06" />
                      <span className="checkout-checkbox-custom"></span>
                      <span>04:00 PM - 06:00 PM</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-delivery-section">
                  <h3 className="checkout-section-label">Shipment Type</h3>
                  <div className="checkout-radio-group">
                    <label className="checkout-radio-label">
                      <input type="radio" name="shipment" value="flat" defaultChecked />
                      <span className="checkout-radio-custom"></span>
                      <span>Flat Rate Shipment</span>
                    </label>
                    <label className="checkout-radio-label">
                      <input type="radio" name="shipment" value="free" />
                      <span className="checkout-radio-custom"></span>
                      <span>Free Shipment</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-delivery-section">
                  <h3 className="checkout-section-label">Address Type</h3>
                  <div className="checkout-radio-group">
                    <label className="checkout-radio-label">
                      <input type="radio" name="addressType" value="home" defaultChecked />
                      <span className="checkout-radio-custom"></span>
                      <span>Home Address</span>
                    </label>
                    <label className="checkout-radio-label">
                      <input type="radio" name="addressType" value="office" />
                      <span className="checkout-radio-custom"></span>
                      <span>Office Address</span>
                    </label>
                    <label className="checkout-radio-label">
                      <input type="radio" name="addressType" value="others" />
                      <span className="checkout-radio-custom"></span>
                      <span>Others</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-shipping-actions">
                  <button type="button" className="checkout-btn-cancel" id="checkout-cancel-btn">
                    Cancel
                  </button>
                  <button type="button" className="checkout-btn-primary" id="checkout-save-btn">
                    Save
                  </button>
                </div>
              </form>
            </section>

            <section className="checkout-card checkout-payment">
              <h2 className="checkout-card-title">Payment</h2>
              <div className="checkout-payment-options">
                <label className="checkout-payment-option checkout-payment-option--selected">
                  <input type="radio" name="payment" value="bank" defaultChecked />
                  <span className="checkout-radio-custom"></span>
                  <div className="checkout-payment-content">
                    <span className="checkout-payment-title">Bank Transfer</span>
                    <p className="checkout-payment-desc">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order
                      will not be shipped until the funds have cleared in our account.
                    </p>
                  </div>
                </label>
                <label className="checkout-payment-option">
                  <input type="radio" name="payment" value="cod" />
                  <span className="checkout-radio-custom"></span>
                  <span className="checkout-payment-title">Cash on Delivery</span>
                </label>
                <label className="checkout-payment-option">
                  <input type="radio" name="payment" value="check" />
                  <span className="checkout-radio-custom"></span>
                  <span className="checkout-payment-title">Check Payment</span>
                </label>
                <label className="checkout-payment-option checkout-payment-option--card">
                  <input type="radio" name="payment" value="credit" />
                  <span className="checkout-radio-custom"></span>
                  <span className="checkout-payment-title">Credit Card</span>
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg"
                    alt="VISA"
                    className="checkout-payment-visa"
                    width="48"
                    height="32"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-right">
            <section className="checkout-card checkout-cart-items">
              <h2 className="checkout-card-title">Cart Items</h2>
              <ul className="checkout-product-list" id="checkout-product-list">
                <li className="checkout-product-item">
                  <img src="/assets/img/watch-4.jpg" alt="Rolex Submariner" className="checkout-product-img" />
                  <div className="checkout-product-details">
                    <span className="checkout-product-name">Rolex Submariner Stainless Steel Watch</span>
                    <span className="checkout-product-qty">1 x 40mm Automatic</span>
                  </div>
                  <div className="checkout-product-price">
                    <span className="checkout-price-old">$12,499</span>
                    <span className="checkout-price-new">$10,999</span>
                  </div>
                </li>
              </ul>
            </section>

            <section className="checkout-card checkout-order-summary">
              <h2 className="checkout-card-title">Order Summary</h2>
              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <span>Sub-Total</span>
                  <span id="checkout-subtotal">$20.00</span>
                </div>
                <div className="checkout-summary-row">
                  <span>VAT (40%)</span>
                  <span id="checkout-vat">$4.00</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Discount</span>
                  <span id="checkout-discount">-$4.00</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Shipment</span>
                  <span id="checkout-shipment">$0.00</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Tax</span>
                  <span id="checkout-tax">$0.00</span>
                </div>
              </div>
              <div className="checkout-summary-divider"></div>
              <div className="checkout-summary-row checkout-summary-total">
                <span>Total</span>
                <span id="checkout-total">$24.00</span>
              </div>
            </section>

            <a href="/order-success.html" className="checkout-proceed-btn" id="checkout-proceed-btn">
              Proceed to Checkout
            </a>
          </aside>
        </div>
      </div>
    </main>
  )
}

