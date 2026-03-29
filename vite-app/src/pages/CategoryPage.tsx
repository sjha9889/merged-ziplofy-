import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function useCategoryMobileFilters() {
  useEffect(() => {
    const filterToggle = document.getElementById('filter-toggle')
    const filterDrawer = document.getElementById('filter-drawer')
    const filterOverlay = document.getElementById('filter-drawer-overlay')
    const filterClose = document.getElementById('filter-drawer-close')

    if (!filterToggle || !filterDrawer || !filterOverlay || !filterClose) return

    const drawerEl = filterDrawer
    const overlayEl = filterOverlay

    function openFilter() {
      drawerEl.classList.add('is-open')
      overlayEl.classList.add('is-open')
      document.body.style.overflow = 'hidden'
    }

    function closeFilter() {
      drawerEl.classList.remove('is-open')
      overlayEl.classList.remove('is-open')
      document.body.style.overflow = ''
    }

    filterToggle.addEventListener('click', openFilter)
    filterClose.addEventListener('click', closeFilter)
    filterOverlay.addEventListener('click', closeFilter)

    return () => {
      filterToggle.removeEventListener('click', openFilter)
      filterClose.removeEventListener('click', closeFilter)
      filterOverlay.removeEventListener('click', closeFilter)
    }
  }, [])
}

export function CategoryPage() {
  useCategoryMobileFilters()

  return (
    <>
      <main className="category-main">
        <div className="category-inner">
          <nav className="category-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>{' '}
              Home
            </Link>
            <span className="breadcrumb-sep">•</span>
            <span>Categories</span>
          </nav>

          <button type="button" id="filter-toggle" className="filter-toggle">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>

          <div className="category-layout">
            <aside className="filter-sidebar">
              <div className="filter-panel">
                <div className="filter-header">
                  <h3>Filters</h3>
                  <button type="button" className="filter-clear">
                    Clear All
                  </button>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Category</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <div className="filter-search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input type="search" placeholder="Search" />
                  </div>
                  <ul className="filter-list">
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Luxury Watches
                        </span>
                        <span className="count">(29)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Automatic Watches
                        </span>
                        <span className="count">(18)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Chronograph
                        </span>
                        <span className="count">(12)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Smart Watches
                        </span>
                        <span className="count">(8)</span>
                      </label>
                    </li>
                  </ul>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Price Range</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <input type="range" min={0} max={100} defaultValue={100} className="filter-slider" />
                  <div className="filter-price-inputs">
                    <input type="text" defaultValue="$ 0" />
                    <span className="to">To</span>
                    <input type="text" defaultValue="$ 100" />
                  </div>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Rating</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <div className="filter-rating-btns">
                    <button type="button" className="rating-btn active">
                      ⭐ 5
                    </button>
                    <button type="button" className="rating-btn">
                      ⭐ 4
                    </button>
                    <button type="button" className="rating-btn">
                      ⭐ 3
                    </button>
                    <button type="button" className="rating-btn">
                      ⭐ 2
                    </button>
                    <button type="button" className="rating-btn">
                      ⭐ 1
                    </button>
                  </div>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Dial Color</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <div className="filter-colors">
                    <button type="button" className="filter-color-swatch" style={{ background: '#000' }}></button>
                    <button type="button" className="filter-color-swatch" style={{ background: '#1e3a8a' }}></button>
                    <button type="button" className="filter-color-swatch" style={{ background: '#c9a227' }}></button>
                    <button type="button" className="filter-color-swatch" style={{ background: '#374151' }}></button>
                    <button
                      type="button"
                      className="filter-color-swatch"
                      style={{ background: '#ffffff', border: '1px solid #ccc' }}
                    ></button>
                  </div>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Case Size</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <div className="filter-size-btns">
                    <button type="button" className="size-btn">
                      38mm
                    </button>
                    <button type="button" className="size-btn">
                      40mm
                    </button>
                    <button type="button" className="size-btn">
                      42mm
                    </button>
                    <button type="button" className="size-btn">
                      44mm
                    </button>
                    <button type="button" className="size-btn">
                      46mm
                    </button>
                  </div>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Discount Range</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <ul className="filter-list">
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> upto 5%
                        </span>
                        <span className="count">(10)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> 5% - 10%
                        </span>
                        <span className="count">(8)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> 10% - 15%
                        </span>
                        <span className="count">(32)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> 15% - 25%
                        </span>
                        <span className="count">(12)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> More than 25%
                        </span>
                        <span className="count">(12)</span>
                      </label>
                    </li>
                  </ul>
                </div>

                <div className="filter-section">
                  <div className="filter-section-header">
                    <span>Brand</span>
                    <button type="button" className="filter-reset">
                      Reset
                    </button>
                  </div>
                  <ul className="filter-list">
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Rolex
                        </span>
                        <span className="count">(6)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Omega
                        </span>
                        <span className="count">(4)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Seiko
                        </span>
                        <span className="count">(9)</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <span>
                          <input type="checkbox" /> Tissot
                        </span>
                        <span className="count">(7)</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            <div className="product-area">
              <div className="product-topbar">
                <div className="product-topbar-left">
                  <div className="view-toggle">
                    <button type="button" aria-label="List view">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button type="button" className="active" aria-label="Grid view">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="product-results">Showing 1–12 of 16 results</span>
                </div>
                <select className="product-sort" defaultValue="Sorting">
                  <option>Sorting</option>
                </select>
              </div>

              <div className="product-grid">
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-1.jpg" alt="Luxury Chronograph Watch" />
                    </div>
                    <h3 className="product-card-title">Luxury Chronograph Stainless Steel Men&apos;s Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="count">(189)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$129.99</span>
                      <span className="old">$179.99</span>
                      <span className="discount">28% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-2.jpg" alt="Classic Leather Watch" />
                    </div>
                    <h3 className="product-card-title">Classic Leather Strap Minimalist Men&apos;s Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="count">(256)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$89.99</span>
                      <span className="old">$129.99</span>
                      <span className="discount">30% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-3.jpg" alt="Automatic Skeleton Watch" />
                    </div>
                    <h3 className="product-card-title">Automatic Skeleton Dial Luxury Mechanical Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★★</span>
                      <span className="count">(142)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$159.99</span>
                      <span className="old">$219.99</span>
                      <span className="discount">27% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-4.jpg" alt="Smart Fitness Watch" />
                    </div>
                    <h3 className="product-card-title">Smart Fitness Tracker Watch with Heart Rate Monitor</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="count">(328)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$69.99</span>
                      <span className="old">$99.99</span>
                      <span className="discount">30% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-5.jpg" alt="Luxury Gold Watch" />
                    </div>
                    <h3 className="product-card-title">Premium Gold Plated Luxury Dress Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★★</span>
                      <span className="count">(234)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$149.99</span>
                      <span className="old">$199.99</span>
                      <span className="discount">25% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-6.jpg" alt="Sport Chronograph Watch" />
                    </div>
                    <h3 className="product-card-title">Waterproof Sport Chronograph Men&apos;s Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★½</span>
                      <span className="count">(412)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$109.99</span>
                      <span className="old">$149.99</span>
                      <span className="discount">27% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-7.jpg" alt="Women's Diamond Watch" />
                    </div>
                    <h3 className="product-card-title">Elegant Women&apos;s Diamond Dial Luxury Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="count">(567)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$119.99</span>
                      <span className="old">$169.99</span>
                      <span className="discount">29% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-8.jpg" alt="Luxury Automatic Watch" />
                    </div>
                    <h3 className="product-card-title">Premium Automatic Stainless Steel Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★½</span>
                      <span className="count">(189)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$179.99</span>
                      <span className="old">$239.99</span>
                      <span className="discount">25% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-9.jpg" alt="Luxury Black Dial Watch" />
                    </div>
                    <h3 className="product-card-title">Black Dial Stainless Steel Luxury Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★★</span>
                      <span className="count">(298)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$134.99</span>
                      <span className="old">$189.99</span>
                      <span className="discount">29% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
                <article className="product-card">
                  <Link to="/product" className="product-card-link">
                    <div className="product-card-image">
                      <img src="/assets/img/category-10.jpg" alt="Classic Silver Watch" />
                    </div>
                    <h3 className="product-card-title">Classic Silver Dial Formal Men&apos;s Watch</h3>
                    <div className="product-card-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="count">(345)</span>
                    </div>
                    <div className="product-card-price">
                      <span className="current">$99.99</span>
                      <span className="old">$139.99</span>
                      <span className="discount">28% OFF</span>
                    </div>
                  </Link>
                  <div className="product-card-actions">
                    <button type="button" className="btn-wishlist" aria-label="Wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <Link to="/product" className="btn-add-cart">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>{' '}
                      Add to Cart
                    </Link>
                  </div>
                </article>
              </div>

              <nav className="pagination" aria-label="Pagination">
                <div className="pagination-inner">
                  <button type="button" aria-label="Previous">
                    ‹
                  </button>
                  <button type="button" className="active">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">4</button>
                  <button type="button">5</button>
                  <span className="ellipsis">...</span>
                  <button type="button" aria-label="Next">
                    ›
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <div id="filter-drawer-overlay" className="filter-drawer-overlay" aria-hidden="true"></div>
      <aside id="filter-drawer" className="filter-drawer">
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filters</h3>
            <button type="button" id="filter-drawer-close" className="filter-drawer-close" aria-label="Close filters">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="filter-section">
            <div className="filter-section-header">
              <span>Category</span>
              <button type="button" className="filter-reset">
                Reset
              </button>
            </div>
            <div className="filter-search">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="search" placeholder="Search" />
            </div>
            <ul className="filter-list">
              <li>
                <label>
                  <span>
                    <input type="checkbox" /> Thermometers
                  </span>
                  <span className="count">(29)</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}

