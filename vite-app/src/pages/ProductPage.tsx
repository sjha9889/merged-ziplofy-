import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function useRelatedSwiperInit() {
  useEffect(() => {
    const anyWindow = window as unknown as {
      Swiper?: new (selector: string, opts: unknown) => unknown
    }
    if (!anyWindow.Swiper) return

    // Avoid creating multiple instances if we re-mount quickly.
    const root = document.querySelector('.related-swiper')
    if (!root || (root as unknown as { __relatedSwiper?: unknown }).__relatedSwiper) return

    try {
      ;(root as unknown as { __relatedSwiper?: unknown }).__relatedSwiper = new anyWindow.Swiper('.related-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: { nextEl: '.related-next', prevEl: '.related-prev' },
        breakpoints: {
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        },
      })
    } catch {
      // ignore
    }
  }, [])
}

export function ProductPage() {
  useRelatedSwiperInit()

  return (
    <>
      <main className="product-section">
        <div className="product-section__inner">
          <nav className="product-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className="product-breadcrumb__sep"></span>
            <span className="product-breadcrumb__current">Luxury Watches</span>
          </nav>

          <div className="product-grid">
            <div className="product-gallery-wrap">
              <div className="product-gallery">
                <div className="product-gallery__thumbs">
                  <button type="button" className="product-gallery__thumb active" data-index="0">
                    <img src="/assets/img/watch-1.jpg" alt="" />
                  </button>
                  <button type="button" className="product-gallery__thumb" data-index="1">
                    <img src="/assets/img/watch-2.jpg" alt="" />
                  </button>
                  <button type="button" className="product-gallery__thumb" data-index="2">
                    <img src="/assets/img/watch-3.jpg" alt="" />
                  </button>
                  <button type="button" className="product-gallery__thumb" data-index="3">
                    <img src="/assets/img/watch-4.jpg" alt="" />
                  </button>
                  <button type="button" className="product-gallery__thumb" data-index="4">
                    <img src="/assets/img/watch-5.jpg" alt="" />
                  </button>
                  <button type="button" className="product-gallery__thumb" data-index="5">
                    <img src="/assets/img/watch-6.jpg" alt="" />
                  </button>
                </div>

                <div className="product-gallery__main-wrap">
                  <div className="product-gallery__main">
                    <img id="product-main-img" src="/assets/img/watch-1.jpg" alt="ChronoMaster Elite Luxury Watch" />
                  </div>

                  <button type="button" className="product-gallery__nav product-gallery__nav--prev">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button type="button" className="product-gallery__nav product-gallery__nav--next">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="product-info-card">
              <div className="product-info">
                <div className="product-info__tags">
                  <span className="product-info__tag product-info__tag--sale">LIMITED EDITION</span>
                  <span className="product-info__tag product-info__tag--new">BEST SELLER</span>
                </div>

                <div className="product-info__title-row">
                  <h1 className="product-info__title">ChronoMaster Elite Automatic Luxury Watch</h1>
                  <button type="button" className="product-info__wishlist">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="product-info__rating">
                  <div className="product-info__stars"></div>
                  <span className="product-info__reviews">(8.4k verified reviews)</span>
                </div>

                <div className="product-info__price-row">
                  <span className="product-info__price">$349.00</span>
                  <span className="product-info__price-old">$499.00</span>
                  <span className="product-info__discount">30% OFF</span>
                </div>

                <div className="product-info__option">
                  <span className="product-info__option-label">Dial Color: Emerald Green</span>
                  <div className="product-info__colors">
                    <button type="button" className="product-info__color active" style={{ ['--swatch' as string]: '#14532d' }}></button>
                    <button type="button" className="product-info__color" style={{ ['--swatch' as string]: '#111827' }}></button>
                    <button type="button" className="product-info__color" style={{ ['--swatch' as string]: '#1e40af' }}></button>
                    <button type="button" className="product-info__color" style={{ ['--swatch' as string]: '#991b1b' }}></button>
                  </div>
                </div>

                <div className="product-info__option">
                  <div className="product-info__size-header">
                    <span className="product-info__size-label">Strap Size: Standard</span>
                    <a href="#" className="product-info__size-guide">
                      Size Guide
                    </a>
                  </div>

                  <div className="product-info__sizes">
                    <button type="button" className="product-info__size active">
                      Standard
                    </button>
                    <button type="button" className="product-info__size">
                      Large
                    </button>
                    <button type="button" className="product-info__size">
                      Extra Large
                    </button>
                  </div>
                </div>

                <div className="product-info__option product-info__qty-section">
                  <div className="product-info__qty-row">
                    <span className="product-info__qty-label">Quantity:</span>
                    <div className="product-info__qty-wrap">
                      <button type="button" className="product-info__qty-btn">
                        −
                      </button>
                      <input type="number" className="product-info__qty-input" defaultValue={1} min={1} max={10} />
                      <button type="button" className="product-info__qty-btn">
                        +
                      </button>
                    </div>

                    <button type="button" className="product-info__btn product-info__btn--buy">
                      Buy Now
                    </button>
                  </div>

                  <button type="button" className="product-info__btn product-info__btn--cart">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>

                <div className="product-info__share-row">
                  <a href="#" className="product-info__share-link">
                    Share
                  </a>
                  <span className="product-info__share-sep">|</span>
                  <a href="#" className="product-info__share-link">
                    Compare
                  </a>
                </div>

                <div className="product-info__meta-block">
                  <p className="product-info__shipping">
                    <strong>Free Shipping Worldwide:</strong>
                    <br />
                    <span className="product-info__shipping-detail">Estimated Delivery 3-5 Business Days</span>
                  </p>
                  <p className="product-info__meta">
                    <strong>SKU:</strong> WATCH-CM-ELITE-01
                  </p>
                  <p className="product-info__meta">
                    <strong>Categories:</strong>
                    <br />
                    <span className="product-info__meta-detail">Luxury Watches, Men&apos;s Watches, Automatic Watches</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="benefits-section">
        <div className="benefits-inner">
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1h-1m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <h3 className="benefits-title">Free Shipping</h3>
            <p className="benefits-desc">Enjoy the Convenience of Free Shipping on Every Order</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="benefits-title">24x7 Support</h3>
            <p className="benefits-desc">Round-the-Clock Assistance, Anytime You Need It</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <h3 className="benefits-title">30 Days Return</h3>
            <p className="benefits-desc">Your Satisfaction is Our Priority: Return Any Product Within 30 Days</p>
          </div>
          <div className="benefits-card">
            <div className="benefits-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v12M15 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm0 5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                />
              </svg>
            </div>
            <h3 className="benefits-title">Secure Payment</h3>
            <p className="benefits-desc">Seamless Shopping Backed by Safe and Secure Payment Options</p>
          </div>
        </div>
      </section>

      <section className="product-desc-section">
        <div className="product-desc-container">
          <div className="product-desc-tabs">
            <button type="button" className="product-desc-tab active" data-tab="description">
              Description
            </button>
            <button type="button" className="product-desc-tab" data-tab="additional">
              Additional Info
            </button>
            <button type="button" className="product-desc-tab" data-tab="reviews">
              Reviews
            </button>
          </div>

          <div id="tab-description" className="product-desc-content active">
            <div className="product-desc-card">
              <h3 className="product-desc-title">Description</h3>
              <p className="product-desc-text">
                The ChronoMaster Elite Automatic Watch is crafted for individuals who appreciate precision, elegance, and timeless design.
                Built with premium stainless steel and a sapphire crystal glass, this luxury timepiece blends modern engineering with classic
                watchmaking tradition.
              </p>
              <p className="product-desc-text">
                Powered by a reliable automatic movement, the watch delivers accurate timekeeping while offering a bold and sophisticated
                presence on the wrist. Whether worn for business meetings, formal events, or everyday style, this watch adds a statement of
                confidence and luxury.
              </p>

              <div className="product-desc-features">
                <div className="product-desc-feature">
                  <span className="product-desc-feature-icon">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Premium stainless steel case with scratch-resistant sapphire crystal
                </div>
                <div className="product-desc-feature">
                  <span className="product-desc-feature-icon">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Precision automatic movement for reliable timekeeping
                </div>
                <div className="product-desc-feature">
                  <span className="product-desc-feature-icon">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Water-resistant construction suitable for daily wear
                </div>
                <div className="product-desc-feature">
                  <span className="product-desc-feature-icon">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Elegant dial design with luminous hands and markers
                </div>
              </div>

              <div className="product-desc-image-wrap">
                <img src="/assets/img/product-banner.jpg" alt="Luxury Watch" className="product-desc-image" />
              </div>

              <div className="product-desc-custom">
                <div className="product-desc-custom-content">
                  <h4 className="product-desc-custom-heading">Premium Craftsmanship</h4>
                  <p className="product-desc-text">
                    Designed with meticulous attention to detail, the ChronoMaster Elite is built to deliver both durability and style. Each
                    component is engineered to provide long-lasting performance while maintaining a refined luxury aesthetic.
                  </p>
                  <ul className="product-desc-custom-list">
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Scratch-resistant sapphire crystal glass
                    </li>
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Durable stainless steel body and premium strap
                    </li>
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Automatic self-winding movement
                    </li>
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Elegant design suitable for business and formal wear
                    </li>
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Water resistant up to 50 meters
                    </li>
                    <li>
                      <span className="product-desc-feature-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Comfortable strap designed for all-day wear
                    </li>
                  </ul>
                </div>
                <div className="product-desc-custom-image-wrap">
                  <img src="/assets/img/watch-4.jpg" alt="Luxury Watch" className="product-desc-custom-image" />
                </div>
              </div>
            </div>
          </div>

          <div id="tab-additional" className="product-desc-content">
            <div className="product-desc-card product-desc-card--info">
              <h3 className="product-desc-info-title">Additional Info</h3>
              <dl className="product-desc-info-list">
                <div className="product-desc-info-row">
                  <dt>Product Type</dt>
                  <dd>Luxury Automatic Watch</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Brand</dt>
                  <dd>ChronoMaster</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Model</dt>
                  <dd>Elite Series CM-01</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Movement</dt>
                  <dd>Automatic Self-Winding</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Case Material</dt>
                  <dd>Stainless Steel</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Glass</dt>
                  <dd>Sapphire Crystal</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Water Resistance</dt>
                  <dd>50 Meters</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Dial Diameter</dt>
                  <dd>42 mm</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Strap Material</dt>
                  <dd>Premium Leather / Stainless Steel</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Display Type</dt>
                  <dd>Analog</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Weight</dt>
                  <dd>145 g</dd>
                </div>
                <div className="product-desc-info-row">
                  <dt>Warranty</dt>
                  <dd>2 Years International Warranty</dd>
                </div>
              </dl>
            </div>
          </div>

          <div id="tab-reviews" className="product-desc-content">
            <div className="product-desc-card">
              <h3 className="product-desc-title">Reviews</h3>
              <p className="product-desc-text">No reviews yet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="related-products" aria-labelledby="related-products-heading">
        <div className="related-products-inner">
          <header className="related-products-header">
            <h2 id="related-products-heading" className="related-products-title">
              Related Watches
            </h2>
            <div className="related-products-nav">
              <button type="button" className="related-prev" aria-label="Previous products">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" className="related-next" aria-label="Next products">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </header>

          <div className="swiper related-swiper">
            <div className="swiper-wrapper">
              <article className="swiper-slide related-card-slide">
                <div className="related-card">
                  <a href="#" className="related-card-link">
                    <div className="related-card-image-wrap">
                      <img src="/assets/img/watch-1.jpg" alt="Luxury Chronograph Watch" className="related-card-image" />
                    </div>
                    <h3 className="related-card-title">Titan Elite Chronograph Stainless Steel Men&apos;s Watch</h3>
                  </a>
                  <div className="related-card-rating">
                    <span className="related-card-stars">★★★★★</span>
                    <span className="related-card-reviews">(214)</span>
                  </div>
                  <div className="related-card-price-row">
                    <span className="related-card-price">$189.00</span>
                    <span className="related-card-price-old">$249.00</span>
                    <span className="related-card-discount">20% OFF</span>
                  </div>
                  <div className="related-card-actions">
                    <button type="button" className="related-card-wishlist" aria-label="Add to wishlist">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button type="button" className="related-card-addcart">
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
              </article>
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding: 24 }}>
        <Link to="/category">Back to category</Link>
      </div>
    </>
  )
}

