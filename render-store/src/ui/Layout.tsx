import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontSearch } from '../contexts/storefront-search.context';
import CartDrawer from '../components/CartDrawer';

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { user, logout } = useStorefrontAuth();
  const { items, guestItems, isGuest } = useStorefrontCart();
  const { searchValue, setSearchValue } = useStorefrontSearch();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const displayItems = isGuest ? guestItems : items;
  const totalItems = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handler = () => {
      setCartOpen(true);
    };
    window.addEventListener('open-cart-drawer', handler as EventListener);
    return () => window.removeEventListener('open-cart-drawer', handler as EventListener);
  }, []);

  useEffect(() => {
    const onDocClick = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [menuOpen]);

  const handleLogoutClick = () => {
    setMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  const storeName = storeFrontMeta?.name || 'Chronova';

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-support">Need Assistance?</span>
            <span className="topbar-call">Call Us</span>
            <a href="tel:4805550103" className="topbar-phone-badge">
              (480) 555-0103
            </a>
            <span className="topbar-divider"></span>
            <span className="topbar-dropdown-wrap">
              <svg className="topbar-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <select className="topbar-select" aria-label="Language" defaultValue="English">
                <option>English</option>
              </select>
              <svg className="topbar-chevron" width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <span className="topbar-dropdown-wrap">
              <svg className="topbar-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select className="topbar-select" aria-label="Currency" defaultValue="USD">
                <option>USD</option>
              </select>
              <svg className="topbar-chevron" width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          <div className="topbar-center">
            <span className="topbar-category">{storeName}</span>
            <span className="topbar-offer-badge">Exclusive Watch Deals</span>
          </div>
          <div className="topbar-right">
            <a href="#" className="topbar-link">About us</a>
            <Link to="/profile" className="topbar-link">My Account</Link>
            <Link to="/wishlist" className="topbar-link">My Wishlist</Link>
            <Link to="/my-orders" className="topbar-link">Order Tracking</Link>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo logo-desktop">
            <span className="logo-text logo-text-desktop">{storeName}</span>
            <span className="logo-underline logo-underline-desktop" aria-hidden="true"></span>
          </Link>

          <div className="header-top-row">
            <button type="button" id="mobile-menu-btn" className="hamburger hamburger-circle" aria-label="Open menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="logo logo-mobile">
              <span className="logo-text">{storeName}</span>
              <span className="logo-underline" aria-hidden="true"></span>
            </Link>

            <button type="button" onClick={() => setCartOpen(true)} className="header-cart-mobile">
              <div className="icon-circle yellow">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="badge-count">{totalItems}</span>
              </div>
            </button>
          </div>

          <div className="header-right header-desktop-icons">
            <div className="header-icon-wrap">
              {user ? (
                <div className="header-account-dropdown">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
                    className="header-icon header-icon-btn"
                  >
                    <div className="icon-circle yellow">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="icon-text">
                      <div className="label">Account</div>
                      <div className="sub">{user.firstName}</div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="header-dropdown-menu"
                      >
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                        <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                        <button type="button" onClick={handleLogoutClick}>Sign out</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/auth/login" className="header-icon">
                  <div className="icon-circle yellow">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="icon-text">
                    <div className="label">Account</div>
                    <div className="sub">log in</div>
                  </div>
                </Link>
              )}
            </div>

            <button type="button" onClick={() => setCartOpen(true)} className="header-icon header-icon-btn">
              <div className="icon-circle yellow">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="badge-count">{totalItems}</span>
              </div>
              <div className="icon-text">
                <div className="label">Cart</div>
                <div className="sub">{totalItems} - Items</div>
              </div>
            </button>
          </div>

          <div className="search-wrap">
            <input
              type="search"
              className="search-input"
              placeholder="Search for the items"
              aria-label="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="button" className="search-btn" aria-label="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav className="nav-bar">
        <div className="nav-inner">
          <Link to="/category" className="categories-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Explore Watch Collections
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)} end>Home</NavLink>
            <NavLink to="/category" className={({ isActive }) => (isActive ? 'active' : undefined)}>Shop</NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : undefined)}>Blog</NavLink>
            <a href="#">About</a>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : undefined)}>Contact</NavLink>
          </div>

          <a href="tel:888777999" className="nav-support">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="nav-support-text">
              <span className="nav-support-label">24/7 Support</span>
              <span className="nav-support-number">888-777-999</span>
            </span>
          </a>
        </div>
      </nav>

      <div id="mobile-nav" className="mobile-nav-overlay" aria-hidden="true"></div>
      <div id="mobile-nav-panel" className="mobile-nav-panel">
        <div className="mobile-nav-header">
          <Link to="/" className="mobile-nav-logo" onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>
            {storeName}
          </Link>
          <button type="button" id="mobile-nav-close" className="mobile-nav-close" aria-label="Close menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mobile-nav-search">
          <input
            type="search"
            placeholder="Search for the Items"
            aria-label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <svg className="mobile-nav-search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <nav className="mobile-nav-links">
          <NavLink to="/" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} end onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>Home</NavLink>
          <a href="#" className="mobile-nav-link">About Us</a>
          <NavLink to="/category" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>Shop</NavLink>
          <NavLink to="/blog" className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`} onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link no-chevron${isActive ? ' active' : ''}`} onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>Contact</NavLink>
        </nav>
        <div className="mobile-nav-actions">
          <Link to={user ? '/profile' : '/auth/login'} className="mobile-nav-action-item" onClick={() => (document.getElementById('mobile-nav-close') as HTMLButtonElement)?.click()}>
            <span className="mobile-nav-action-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            {user ? `${user.firstName} ${user.lastName}` : 'log in / Sign Up'}
          </Link>
          <a href="tel:888777999" className="mobile-nav-action-item">
            <span className="mobile-nav-action-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            888-777-999
          </a>
        </div>
        <div className="mobile-nav-follow">
          <h3 className="mobile-nav-follow-title">Follow us</h3>
          <div className="mobile-nav-social">
            <a href="#" className="mobile-nav-social-icon" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="mobile-nav-social-icon" aria-label="Instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" className="mobile-nav-social-icon" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`} end>
          <svg className="bottom-nav-icon" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </NavLink>
        <NavLink to="/my-orders" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <svg className="bottom-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8 4-8-4m0 0l8-4 8 4m0 6l-8 4-8-4m0 0l8-4 8 4" />
          </svg>
          <span>My Order</span>
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <svg className="bottom-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Wishlist</span>
        </NavLink>
        <button type="button" onClick={() => setCartOpen(true)} className="bottom-nav-item">
          <svg className="bottom-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Cart</span>
        </button>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
          <svg className="bottom-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>My Account</span>
        </NavLink>
      </nav>

      {children}

      <footer className="footer-modave" role="contentinfo">
        <div className="footer-modave-main">
          <div className="footer-modave-inner">
            <div className="footer-modave-grid">
              <div className="footer-modave-col footer-modave-brand">
                <Link to="/" className="footer-modave-logo">{storeName} Watches</Link>
                <p className="footer-modave-address">245 Luxury Avenue, New York, NY 10012</p>
                <a href="#" className="footer-modave-direction">VIEW STORE LOCATION <i className="bi bi-arrow-up-right"></i></a>
                <p className="footer-modave-contact"><i className="bi bi-envelope"></i> support@{storeFrontMeta?.storeId || 'store'}.com</p>
                <p className="footer-modave-contact"><i className="bi bi-telephone"></i> +1 (800) 245-8899</p>
                <div className="footer-modave-social">
                  <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                  <a href="#" aria-label="X"><i className="bi bi-twitter-x"></i></a>
                  <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                  <a href="#" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
                  <a href="#" aria-label="Threads"><i className="bi bi-threads"></i></a>
                  <a href="#" aria-label="Pinterest"><i className="bi bi-pinterest"></i></a>
                </div>
              </div>
              <div className="footer-modave-col">
                <h3 className="footer-modave-title">Company</h3>
                <ul className="footer-modave-links">
                  <li><a href="#">About Our Brand</a></li>
                  <li><a href="#">Watch Craftsmanship</a></li>
                  <li><a href="#">Our Collections</a></li>
                  <li><a href="#">Store Locations</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><Link to="/profile">My Account</Link></li>
                </ul>
              </div>
              <div className="footer-modave-col">
                <h3 className="footer-modave-title">Customer Services</h3>
                <ul className="footer-modave-links">
                  <li><a href="#">Shipping Information</a></li>
                  <li><a href="#">Returns & Exchanges</a></li>
                  <li><a href="#">Warranty Policy</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms & Conditions</a></li>
                  <li><a href="#">Order FAQs</a></li>
                </ul>
              </div>
              <div className="footer-modave-col footer-modave-newsletter-col">
                <h3 className="footer-modave-title">Join Our Community</h3>
                <p className="footer-modave-newsletter-desc">Subscribe to receive exclusive offers, new watch releases, and style inspiration.</p>
                <form className="footer-modave-newsletter-form" action="#" method="post" aria-label="Newsletter signup">
                  <input type="email" name="email" placeholder="Enter your e-mail..." className="footer-modave-newsletter-input" />
                  <button type="submit" className="footer-modave-newsletter-btn" aria-label="Subscribe"><i className="bi bi-arrow-up-right"></i></button>
                </form>
                <label className="footer-modave-checkbox">
                  <input type="checkbox" name="agree" />
                  <span className="footer-modave-checkbox-text">By subscribing you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-modave-divider"></div>
        <div className="footer-modave-bottom">
          <div className="footer-modave-bottom-inner">
            <p className="footer-modave-copyright">©{new Date().getFullYear()} {storeName} Watches. All Rights Reserved.</p>
            <div className="footer-modave-dropdowns">
              <select className="footer-modave-select" aria-label="Currency" defaultValue="USD">
                <option>USD</option>
                <option>EUR</option>
                <option>INR</option>
              </select>
              <select className="footer-modave-select" aria-label="Language" defaultValue="English">
                <option>English</option>
              </select>
            </div>
            <div className="footer-modave-payment">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg" alt="Visa" width="36" height="24" />
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg" alt="Mastercard" width="36" height="24" />
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg" alt="American Express" width="36" height="24" />
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg" alt="PayPal" width="36" height="24" />
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discover.svg" alt="Discover" width="36" height="24" />
            </div>
            <button type="button" className="footer-modave-scroll-top" aria-label="Scroll to top"><i className="bi bi-chevron-up"></i></button>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign out</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl">Cancel</button>
                <button onClick={confirmLogout} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl">Sign out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
