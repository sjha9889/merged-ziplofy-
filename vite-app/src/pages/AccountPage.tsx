import { Link } from 'react-router-dom'

export function AccountPage() {
  return (
    <>
      <main className="account-page">
        <div className="account-inner">
          <nav className="account-breadcrumb" aria-label="Breadcrumb">
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
            <span className="account-breadcrumb-sep">•</span>
            <span className="account-breadcrumb-current">User Dashboard</span>
            <span className="account-breadcrumb-sep">•</span>
            <span className="account-breadcrumb-current">Orders History</span>
          </nav>

          <div className="account-layout">
            <aside className="account-sidebar">
              <nav className="account-nav" aria-label="Account navigation">
                <button type="button" className="account-nav-item" data-panel="dashboard">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Dashboard
                </button>
                <button type="button" className="account-nav-item active" data-panel="orders">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Orders
                </button>
                <button type="button" className="account-nav-item" data-panel="wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Wishlist
                </button>
                <button type="button" className="account-nav-item" data-panel="address">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  My Address
                </button>
                <button type="button" className="account-nav-item" data-panel="account">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Account
                </button>
                <button type="button" className="account-nav-item" id="account-logout-btn">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log Out
                </button>
              </nav>
            </aside>

            <div className="account-panel account-panel-dashboard" id="panel-dashboard" hidden>
              <h1 className="account-content-title">Dashboard</h1>
              <p className="account-content-text">
                From your account dashboard, you can easily check &amp; view your{' '}
                <a href="#" className="account-content-link" data-panel="orders">
                  recent orders
                </a>
                , manage your <a href="#" className="account-content-link">shipping and billing addresses</a> and edit your{' '}
                <a href="#" className="account-content-link" data-panel="account">
                  password and account details
                </a>
                .
              </p>
            </div>

            <div className="account-panel account-panel-orders" id="panel-orders">
              <h1 className="account-content-title">Orders History</h1>
              <div className="account-orders-tabs" role="tablist">
                <button type="button" className="account-order-tab active" data-filter="all" role="tab">
                  All
                </button>
                <button type="button" className="account-order-tab" data-filter="processing" role="tab">
                  Processing
                </button>
                <button type="button" className="account-order-tab" data-filter="delivering" role="tab">
                  Delivering
                </button>
                <button type="button" className="account-order-tab" data-filter="completed" role="tab">
                  Completed
                </button>
                <button type="button" className="account-order-tab" data-filter="cancelled" role="tab">
                  Cancelled
                </button>
              </div>

              <div className="account-orders-list">
                <div className="account-order-card" data-order-status="processing">
                  <div className="account-order-header">
                    <span className="account-order-id">Order ID : #65937</span>
                    <span className="account-order-badge status-processing">Processing</span>
                  </div>
                  <div className="account-order-details">
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Order Date:</span>
                      <span>11:12 AM, 24 April, 2027</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>Order Items</span>
                      <span>114 Products</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      <span>Delivery Method</span>
                      <span>Free Delivery</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Amount Payable</span>
                      <span>
                        $40.00 <em className="paid">(Paid)</em>
                      </span>
                    </div>
                  </div>
                  <div className="account-order-actions">
                    <Link to="/order-success" className="account-order-btn account-order-btn-secondary">
                      View Details
                    </Link>
                    <Link to="/category" className="account-order-btn account-order-btn-primary">
                      Order Again
                    </Link>
                  </div>
                </div>

                <div className="account-order-card" data-order-status="delivering">
                  <div className="account-order-header">
                    <span className="account-order-id">Order ID : #65938</span>
                    <span className="account-order-badge status-delivering">Delivering</span>
                  </div>
                  <div className="account-order-details">
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Order Date:</span>
                      <span>09:30 AM, 22 April, 2027</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>Order Items</span>
                      <span>3 Products</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      <span>Delivery Method</span>
                      <span>Express Delivery</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Amount Payable</span>
                      <span>
                        $299.00 <em className="paid">(Paid)</em>
                      </span>
                    </div>
                  </div>
                  <div className="account-order-actions">
                    <Link to="/order-success" className="account-order-btn account-order-btn-secondary">
                      View Details
                    </Link>
                    <Link to="/category" className="account-order-btn account-order-btn-primary">
                      Order Again
                    </Link>
                  </div>
                </div>

                <div className="account-order-card" data-order-status="completed">
                  <div className="account-order-header">
                    <span className="account-order-id">Order ID : #65935</span>
                    <span className="account-order-badge status-completed">Completed</span>
                  </div>
                  <div className="account-order-details">
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Order Date:</span>
                      <span>02:45 PM, 18 April, 2027</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>Order Items</span>
                      <span>2 Products</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      <span>Delivery Method</span>
                      <span>Free Delivery</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Amount Payable</span>
                      <span>
                        $89.00 <em className="paid">(Paid)</em>
                      </span>
                    </div>
                  </div>
                  <div className="account-order-actions">
                    <a href="/order-success.html" className="account-order-btn account-order-btn-secondary">
                      View Details
                    </a>
                    <a href="/category.html" className="account-order-btn account-order-btn-primary">
                      Order Again
                    </a>
                  </div>
                </div>

                <div className="account-order-card" data-order-status="cancelled">
                  <div className="account-order-header">
                    <span className="account-order-id">Order ID : #65934</span>
                    <span className="account-order-badge status-cancelled">Cancelled</span>
                  </div>
                  <div className="account-order-details">
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Order Date:</span>
                      <span>10:00 AM, 15 April, 2027</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>Order Items</span>
                      <span>1 Product</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                      <span>Delivery Method</span>
                      <span>Free Delivery</span>
                    </div>
                    <div className="account-order-row">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Amount Payable</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  <div className="account-order-actions">
                    <a href="#" className="account-order-btn account-order-btn-secondary">
                      View Details
                    </a>
                    <a href="/category.html" className="account-order-btn account-order-btn-primary">
                      Order Again
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="account-panel account-panel-wishlist" id="panel-wishlist" hidden>
              <h1 className="account-content-title">Wishlist</h1>
              <div className="account-wishlist-header">
                <span className="account-wishlist-selected" id="account-wishlist-selected">
                  2 items is selected
                </span>
                <button type="button" className="account-wishlist-add-cart" id="account-wishlist-add-cart">
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

              <div className="account-wishlist-table-wrap">
                <table className="account-wishlist-table">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" className="account-wl-checkbox" id="account-wl-check-all" aria-label="Select all" />
                      </th>
                      <th>Product</th>
                      <th>Stock Status</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Buy Action</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="account-wishlist-row" data-id="1">
                      <td data-label="">
                        <input
                          type="checkbox"
                          className="account-wl-checkbox account-wl-check-item"
                          aria-label="Select item"
                          defaultChecked
                        />
                      </td>
                      <td data-label="Product">
                        <Link to="/product" className="account-wl-product">
                          <img src="/assets/img/watch-1.jpg" alt="Apex Chronograph Watch" className="account-wl-img" />
                          <div className="account-wl-details">
                            <span className="account-wl-name">Apex Chronograph Watch</span>
                            <span className="account-wl-cat">Luxury Watches</span>
                            <span className="account-wl-rating">
                              ★★★★½ <span>(189)</span>
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td data-label="Stock">
                        <span className="account-wl-stock">2 In Stock</span>
                      </td>
                      <td data-label="Price">
                        <span className="account-wl-price-current">$27.49</span>
                        <span className="account-wl-price-old">$29.95</span>
                      </td>
                      <td data-label="Quantity">
                        <div className="account-wl-qty">
                          <button type="button" className="account-wl-qty-btn" data-action="minus">
                            −
                          </button>
                          <input type="number" className="account-wl-qty-input" defaultValue={1} min={1} max={99} readOnly />
                          <button type="button" className="account-wl-qty-btn" data-action="plus">
                            +
                          </button>
                        </div>
                      </td>
                      <td data-label="Buy Action">
                        <div className="account-wl-buy">
                          <Link to="/checkout" className="account-wl-buy-now">
                            Buy Now
                          </Link>
                          <button type="button" className="account-wl-add-cart">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Add To Cart
                          </button>
                        </div>
                      </td>
                      <td data-label="">
                        <button type="button" className="account-wl-remove" aria-label="Remove">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    <tr className="account-wishlist-row" data-id="2">
                      <td data-label="">
                        <input
                          type="checkbox"
                          className="account-wl-checkbox account-wl-check-item"
                          aria-label="Select item"
                          defaultChecked
                        />
                      </td>
                      <td data-label="Product">
                        <Link to="/product" className="account-wl-product">
                          <img src="/assets/img/watch-2.jpg" alt="Lunar Automatic Watch" className="account-wl-img" />
                          <div className="account-wl-details">
                            <span className="account-wl-name">Lunar Automatic Watch</span>
                            <span className="account-wl-cat">Automatic Watches</span>
                            <span className="account-wl-rating">
                              ★★★★☆ <span>(124)</span>
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td data-label="Stock">
                        <span className="account-wl-stock">5 In Stock</span>
                      </td>
                      <td data-label="Price">
                        <span className="account-wl-price-current">$89.99</span>
                        <span className="account-wl-price-old">$99.99</span>
                      </td>
                      <td data-label="Quantity">
                        <div className="account-wl-qty">
                          <button type="button" className="account-wl-qty-btn" data-action="minus">
                            −
                          </button>
                          <input type="number" className="account-wl-qty-input" defaultValue={1} min={1} max={99} readOnly />
                          <button type="button" className="account-wl-qty-btn" data-action="plus">
                            +
                          </button>
                        </div>
                      </td>
                      <td data-label="Buy Action">
                        <div className="account-wl-buy">
                          <Link to="/checkout" className="account-wl-buy-now">
                            Buy Now
                          </Link>
                          <button type="button" className="account-wl-add-cart">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Add To Cart
                          </button>
                        </div>
                      </td>
                      <td data-label="">
                        <button type="button" className="account-wl-remove" aria-label="Remove">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    <tr className="account-wishlist-row" data-id="3">
                      <td data-label="">
                        <input type="checkbox" className="account-wl-checkbox account-wl-check-item" aria-label="Select item" />
                      </td>
                      <td data-label="Product">
                        <Link to="/product" className="account-wl-product">
                          <img src="/assets/img/watch-3.jpg" alt="Aurora Minimal Watch" className="account-wl-img" />
                          <div className="account-wl-details">
                            <span className="account-wl-name">Aurora Minimal Watch</span>
                            <span className="account-wl-cat">Minimal Watches</span>
                            <span className="account-wl-rating">
                              ★★★★½ <span>(203)</span>
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td data-label="Stock">
                        <span className="account-wl-stock">2 In Stock</span>
                      </td>
                      <td data-label="Price">
                        <span className="account-wl-price-current">$27.49</span>
                        <span className="account-wl-price-old">$29.95</span>
                      </td>
                      <td data-label="Quantity">
                        <div className="account-wl-qty">
                          <button type="button" className="account-wl-qty-btn" data-action="minus">
                            −
                          </button>
                          <input type="number" className="account-wl-qty-input" defaultValue={1} min={1} max={99} readOnly />
                          <button type="button" className="account-wl-qty-btn" data-action="plus">
                            +
                          </button>
                        </div>
                      </td>
                      <td data-label="Buy Action">
                        <div className="account-wl-buy">
                          <Link to="/checkout" className="account-wl-buy-now">
                            Buy Now
                          </Link>
                          <button type="button" className="account-wl-add-cart">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Add To Cart
                          </button>
                        </div>
                      </td>
                      <td data-label="">
                        <button type="button" className="account-wl-remove" aria-label="Remove">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="account-panel account-panel-address" id="panel-address" hidden>
              <div className="account-address-list-view" id="address-list-view">
                <div className="account-address-header">
                  <h1 className="account-content-title">Address</h1>
                  <button type="button" className="account-address-add-btn" id="address-add-btn">
                    Add New Address
                  </button>
                </div>
                <div className="account-address-grid">
                  <div className="account-address-card" data-address-type="home">
                    <div className="account-address-card-header">
                      <h3 className="account-address-card-title">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Home Address
                      </h3>
                      <button type="button" className="account-address-change-btn" data-address-type="home">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Change
                      </button>
                    </div>
                    <div className="account-address-body">
                      <p>1234 Elm Street</p>
                      <p>Springfield</p>
                      <p>CA 90210</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div className="account-address-card" data-address-type="office">
                    <div className="account-address-card-header">
                      <h3 className="account-address-card-title">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Office Address
                      </h3>
                      <button type="button" className="account-address-change-btn" data-address-type="office">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Change
                      </button>
                    </div>
                    <div className="account-address-body">
                      <p>1234 Elm Street</p>
                      <p>Springfield</p>
                      <p>CA 90210</p>
                      <p>United States</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="account-address-form-view" id="address-form-view" hidden>
                <div className="account-address-form-header">
                  <button type="button" className="account-address-back-btn" id="address-form-back" aria-label="Back">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  <h1 className="account-content-title" id="address-form-title">
                    Add New Address
                  </h1>
                </div>
                <form className="account-address-form" id="address-form">
                  <div className="account-address-form-section">
                    <h3 className="account-address-form-section-title">Shipping Address</h3>
                    <div className="account-address-form-row">
                      <div className="account-address-form-group account-address-form-group-wide">
                        <label htmlFor="address-country" className="account-address-form-label">
                          Country / Region
                        </label>
                        <select id="address-country" className="account-address-form-input" name="country" defaultValue="US">
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                        <svg className="account-address-form-chevron" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="account-address-form-group">
                        <label htmlFor="address-city" className="account-address-form-label">
                          City
                        </label>
                        <input type="text" id="address-city" className="account-address-form-input" name="city" placeholder="City" defaultValue="" />
                      </div>
                      <div className="account-address-form-group">
                        <label htmlFor="address-state" className="account-address-form-label">
                          State
                        </label>
                        <input type="text" id="address-state" className="account-address-form-input" name="state" placeholder="State" defaultValue="" />
                      </div>
                      <div className="account-address-form-group">
                        <label htmlFor="address-zip" className="account-address-form-label">
                          Zip Code
                        </label>
                        <input type="text" id="address-zip" className="account-address-form-input" name="zip" placeholder="Zip Code" defaultValue="" />
                      </div>
                    </div>
                    <div className="account-address-form-group account-address-form-group-full">
                      <label htmlFor="address-line" className="account-address-form-label">
                        Apartments, suit, unit, etc (Optional)
                      </label>
                      <textarea id="address-line" className="account-address-form-textarea" name="addressLine" rows={4} placeholder="Apartments, suit, unit, etc"></textarea>
                    </div>
                  </div>
                  <div className="account-address-form-section">
                    <h3 className="account-address-form-section-title">Delivery Schedule</h3>
                    <div className="account-address-form-radios">
                      <label className="account-address-form-radio">
                        <input type="radio" name="addressType" value="home" defaultChecked />
                        <span className="account-address-form-radio-text">Home Address</span>
                      </label>
                      <label className="account-address-form-radio">
                        <input type="radio" name="addressType" value="office" />
                        <span className="account-address-form-radio-text">Office Address</span>
                      </label>
                      <label className="account-address-form-radio">
                        <input type="radio" name="addressType" value="others" />
                        <span className="account-address-form-radio-text">Others</span>
                      </label>
                    </div>
                  </div>
                  <div className="account-address-form-actions">
                    <button type="button" className="account-address-form-cancel" id="address-form-cancel">
                      Cancel
                    </button>
                    <button type="submit" className="account-address-form-save">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="account-panel account-panel-account" id="panel-account" hidden>
              <h1 className="account-content-title">My Account</h1>

              <div className="account-profile-card">
                <h3 className="account-profile-section-title">Personal Information</h3>
                <div className="account-profile-upload">
                  <input type="file" id="account-profile-photo" className="account-profile-photo-input" accept="image/*" aria-label="Upload photo" />
                  <div className="account-profile-upload-inner">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
                  </svg>
                    <span>Upload photo</span>
                  </div>
                </div>
                <div className="account-profile-fields">
                  <div className="account-profile-row">
                    <div className="account-profile-field">
                      <label htmlFor="account-first-name" className="account-profile-label">
                        First Name
                      </label>
                      <input type="text" id="account-first-name" className="account-profile-input" name="firstName" placeholder="First Name" />
                    </div>
                    <div className="account-profile-field">
                      <label htmlFor="account-last-name" className="account-profile-label">
                        Last Name
                      </label>
                      <input type="text" id="account-last-name" className="account-profile-input" name="lastName" placeholder="Last Name" />
                    </div>
                  </div>
                  <div className="account-profile-row">
                    <div className="account-profile-field">
                      <label htmlFor="account-phone" className="account-profile-label">
                        Phone Number
                      </label>
                      <input type="tel" id="account-phone" className="account-profile-input" name="phone" placeholder="Phone Number" />
                    </div>
                    <div className="account-profile-field">
                      <label htmlFor="account-email" className="account-profile-label">
                        Email Address (Optional)
                      </label>
                      <input type="email" id="account-email" className="account-profile-input" name="email" placeholder="Email Address" />
                    </div>
                  </div>
                </div>
                <div className="account-profile-actions">
                  <button type="button" className="account-profile-save">
                    Save
                  </button>
                </div>
              </div>

              <div className="account-profile-card">
                <h3 className="account-profile-section-title">Password Change</h3>
                <form className="account-password-form" id="account-password-form">
                  <div className="account-profile-fields">
                    <div className="account-profile-field account-profile-field-full">
                      <label htmlFor="account-current-password" className="account-profile-label">
                        Password
                      </label>
                      <input type="password" id="account-current-password" className="account-profile-input" name="currentPassword" placeholder="Password" />
                    </div>
                    <div className="account-profile-field account-profile-field-full">
                      <label htmlFor="account-new-password" className="account-profile-label">
                        New Password
                      </label>
                      <input type="password" id="account-new-password" className="account-profile-input" name="newPassword" placeholder="New Password" />
                    </div>
                    <div className="account-profile-field account-profile-field-full">
                      <label htmlFor="account-confirm-password" className="account-profile-label">
                        Confirm New Password
                      </label>
                      <input type="password" id="account-confirm-password" className="account-profile-input" name="confirmPassword" placeholder="Confirm New Password" />
                    </div>
                  </div>
                  <div className="account-profile-actions">
                    <button type="submit" className="account-profile-save">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="logout-modal-overlay" id="logout-modal" aria-hidden="true">
        <div className="logout-modal" role="dialog" aria-labelledby="logout-modal-title" aria-modal="true">
          <h2 className="logout-modal-title" id="logout-modal-title">
            Logout Information
          </h2>
          <p className="logout-modal-message">Are you sure you want to logout?</p>
          <div className="logout-modal-actions">
            <button type="button" className="logout-modal-cancel" id="logout-modal-cancel">
              Cancel
            </button>
            <button type="button" className="logout-modal-confirm" id="logout-modal-confirm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

