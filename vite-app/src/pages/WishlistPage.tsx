import { Link } from 'react-router-dom'

export function WishlistPage() {
  return (
    <main className="wishlist-page">
      <div className="wishlist-inner">
        <nav className="wishlist-breadcrumb" aria-label="Breadcrumb">
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
          <span className="wishlist-breadcrumb-sep">•</span>
          <span className="wishlist-breadcrumb-current">Wishlist</span>
        </nav>

        <div className="wishlist-header-row">
          <h1 className="wishlist-title">Product Wishlist</h1>
          <div className="wishlist-bulk-bar" id="wishlist-bulk-bar" hidden>
            <span className="wishlist-selected-count" id="wishlist-selected-count">
              0 items is selected
            </span>
            <button type="button" className="wishlist-bulk-add-cart btn-add-cart" id="wishlist-bulk-add">
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
        </div>

        <div className="wishlist-table-wrap" id="wishlist-table-wrap">
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="wishlist-checkbox wishlist-check-all"
                    id="wishlist-check-all"
                    aria-label="Select all"
                  />
                </th>
                <th>Product</th>
                <th>Stock Status</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Buy Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody id="wishlist-tbody">
              <tr className="wishlist-row" data-id="1">
                <td>
                  <input type="checkbox" className="wishlist-checkbox wishlist-check-item" aria-label="Select item" />
                </td>
                <td data-label="Product">
                  <div className="wishlist-product">
                    <Link to="/product" className="wishlist-product-link">
                      <img src="/assets/img/watch-1.jpg" alt="Apex Chronograph Watch" className="wishlist-product-img" />
                      <div className="wishlist-product-details">
                        <span className="wishlist-product-name">Apex Chronograph Watch</span>
                        <span className="wishlist-product-cat">Luxury Watches</span>
                        <span className="wishlist-product-rating">
                          ★★★★½ <span className="wishlist-product-reviews">(189)</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </td>
                <td data-label="Stock Status">
                  <span className="wishlist-stock">2 In Stock</span>
                </td>
                <td data-label="Price">
                  <div className="wishlist-price-cell">
                    <span className="wishlist-price-current">$189.99</span>
                    <span className="wishlist-price-old">$229.99</span>
                  </div>
                </td>
                <td data-label="Quantity">
                  <div className="wishlist-qty-wrap">
                    <button type="button" className="wishlist-qty-btn" data-action="minus" aria-label="Decrease">
                      −
                    </button>
                    <input type="number" className="wishlist-qty-input" defaultValue={1} min={1} max={99} readOnly aria-label="Quantity" />
                    <button type="button" className="wishlist-qty-btn" data-action="plus" aria-label="Increase">
                      +
                    </button>
                  </div>
                </td>
                <td data-label="Buy Action">
                  <div className="wishlist-buy-actions">
                    <Link to="/checkout" className="wishlist-buy-now">
                      Buy Now
                    </Link>
                    <button type="button" className="wishlist-add-cart btn-add-cart">
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
                <td data-label="Remove">
                  <button type="button" className="wishlist-remove" aria-label="Remove from wishlist">
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
              <tr className="wishlist-row" data-id="2">
                <td>
                  <input type="checkbox" className="wishlist-checkbox wishlist-check-item" aria-label="Select item" />
                </td>
                <td data-label="Product">
                  <div className="wishlist-product">
                    <Link to="/product" className="wishlist-product-link">
                      <img src="/assets/img/watch-2.jpg" alt="Lunar Automatic Watch" className="wishlist-product-img" />
                      <div className="wishlist-product-details">
                        <span className="wishlist-product-name">Lunar Automatic Watch</span>
                        <span className="wishlist-product-cat">Automatic Watches</span>
                        <span className="wishlist-product-rating">
                          ★★★★☆ <span className="wishlist-product-reviews">(124)</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </td>
                <td data-label="Stock Status">
                  <span className="wishlist-stock">5 In Stock</span>
                </td>
                <td data-label="Price">
                  <div className="wishlist-price-cell">
                    <span className="wishlist-price-current">$89.99</span>
                    <span className="wishlist-price-old">$99.99</span>
                  </div>
                </td>
                <td data-label="Quantity">
                  <div className="wishlist-qty-wrap">
                    <button type="button" className="wishlist-qty-btn" data-action="minus" aria-label="Decrease">
                      −
                    </button>
                    <input type="number" className="wishlist-qty-input" defaultValue={1} min={1} max={99} readOnly aria-label="Quantity" />
                    <button type="button" className="wishlist-qty-btn" data-action="plus" aria-label="Increase">
                      +
                    </button>
                  </div>
                </td>
                <td data-label="Buy Action">
                  <div className="wishlist-buy-actions">
                    <Link to="/checkout" className="wishlist-buy-now">
                      Buy Now
                    </Link>
                    <button type="button" className="wishlist-add-cart btn-add-cart">
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
                <td data-label="Remove">
                  <button type="button" className="wishlist-remove" aria-label="Remove from wishlist">
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
              <tr className="wishlist-row" data-id="3">
                <td>
                  <input type="checkbox" className="wishlist-checkbox wishlist-check-item" aria-label="Select item" />
                </td>
                <td data-label="Product">
                  <div className="wishlist-product">
                    <Link to="/product" className="wishlist-product-link">
                      <img src="/assets/img/watch-3.jpg" alt="Aurora Minimal Watch" className="wishlist-product-img" />
                      <div className="wishlist-product-details">
                        <span className="wishlist-product-name">Aurora Minimal Watch</span>
                        <span className="wishlist-product-cat">Minimalist Watches</span>
                        <span className="wishlist-product-rating">
                          ★★★★★ <span className="wishlist-product-reviews">(256)</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </td>
                <td data-label="Stock Status">
                  <span className="wishlist-stock">3 In Stock</span>
                </td>
                <td data-label="Price">
                  <div className="wishlist-price-cell">
                    <span className="wishlist-price-current">$149.99</span>
                    <span className="wishlist-price-old">$169.99</span>
                  </div>
                </td>
                <td data-label="Quantity">
                  <div className="wishlist-qty-wrap">
                    <button type="button" className="wishlist-qty-btn" data-action="minus" aria-label="Decrease">
                      −
                    </button>
                    <input type="number" className="wishlist-qty-input" defaultValue={1} min={1} max={99} readOnly aria-label="Quantity" />
                    <button type="button" className="wishlist-qty-btn" data-action="plus" aria-label="Increase">
                      +
                    </button>
                  </div>
                </td>
                <td data-label="Buy Action">
                  <div className="wishlist-buy-actions">
                    <Link to="/checkout" className="wishlist-buy-now">
                      Buy Now
                    </Link>
                    <button type="button" className="wishlist-add-cart btn-add-cart">
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
                <td data-label="Remove">
                  <button type="button" className="wishlist-remove" aria-label="Remove from wishlist">
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
              <tr className="wishlist-row" data-id="4">
                <td>
                  <input type="checkbox" className="wishlist-checkbox wishlist-check-item" aria-label="Select item" />
                </td>
                <td data-label="Product">
                  <div className="wishlist-product">
                    <Link to="/product" className="wishlist-product-link">
                      <img src="/assets/img/watch-4.jpg" alt="Classic Leather Watch" className="wishlist-product-img" />
                      <div className="wishlist-product-details">
                        <span className="wishlist-product-name">Classic Leather Strap Watch</span>
                        <span className="wishlist-product-cat">Classic Watches</span>
                        <span className="wishlist-product-rating">
                          ★★★★☆ <span className="wishlist-product-reviews">(67)</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </td>
                <td data-label="Stock Status">
                  <span className="wishlist-stock">8 In Stock</span>
                </td>
                <td data-label="Price">
                  <div className="wishlist-price-cell">
                    <span className="wishlist-price-current">$79.99</span>
                    <span className="wishlist-price-old">$99.99</span>
                  </div>
                </td>
                <td data-label="Quantity">
                  <div className="wishlist-qty-wrap">
                    <button type="button" className="wishlist-qty-btn" data-action="minus" aria-label="Decrease">
                      −
                    </button>
                    <input type="number" className="wishlist-qty-input" defaultValue={1} min={1} max={99} readOnly aria-label="Quantity" />
                    <button type="button" className="wishlist-qty-btn" data-action="plus" aria-label="Increase">
                      +
                    </button>
                  </div>
                </td>
                <td data-label="Buy Action">
                  <div className="wishlist-buy-actions">
                    <Link to="/checkout" className="wishlist-buy-now">
                      Buy Now
                    </Link>
                    <button type="button" className="wishlist-add-cart btn-add-cart">
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
                <td data-label="Remove">
                  <button type="button" className="wishlist-remove" aria-label="Remove from wishlist">
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

        <div className="wishlist-empty" id="wishlist-empty" hidden>
          <div className="wishlist-empty-icon">
            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
          <p className="wishlist-empty-desc">Add items you love to your wishlist and they'll show up here.</p>
          <Link to="/category" className="wishlist-empty-cta">
            Start Shopping
          </Link>
        </div>

        <Link to="/category" className="wishlist-continue">
          Continue Shopping →
        </Link>
      </div>
    </main>
  )
}

