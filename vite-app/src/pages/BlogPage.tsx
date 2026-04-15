import { Link } from 'react-router-dom'

export function BlogPage() {
  return (
    <main className="blog-page">
      <div className="blog-inner">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
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
          <span className="blog-breadcrumb-sep">•</span>
          <span className="blog-breadcrumb-current">Blog Page</span>
        </nav>

        <header className="blog-header">
          <h1 className="blog-title">Watch Style &amp; Timepiece Journal</h1>
          <p className="blog-subtitle">
            Explore expert guides, watch history, maintenance tips, and style inspiration for modern watch lovers.
          </p>
        </header>

        <div className="blog-topbar">
          <div className="blog-topbar-left">
            <div className="blog-view-toggle" role="group" aria-label="View mode">
              <button type="button" className="blog-view-btn" data-view="list" aria-label="List view" title="List view">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button type="button" className="blog-view-btn active" data-view="grid" aria-label="Grid view" title="Grid view">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="blog-topbar-right">
            <div className="blog-sort-wrap">
              <select className="blog-sort-select" aria-label="Sort posts" defaultValue="Sorting">
                <option>Sorting</option>
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Popular</option>
              </select>
            </div>
            <div className="blog-search-wrap">
              <svg className="blog-search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input type="search" className="blog-search-input" placeholder="Search..." aria-label="Search blog" />
            </div>
          </div>
        </div>

        <div className="blog-layout">
          <div className="blog-main">
            <div className="blog-grid" id="blog-grid">
              <article className="blog-card">
                <Link to="/blog-detail" className="blog-card-link">
                  <div className="blog-card-image">
                    <img src="/assets/img/watch-3.jpg" alt="How to Choose the Right Watch" width="400" height="200" />
                  </div>
                  <div className="blog-card-content">
                    <span className="blog-card-category">Watch Guide</span>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>{' '}
                        12:40 PM, 09 Feb 2027
                      </span>
                      <span className="blog-card-comments">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>{' '}
                        Comment (10)
                      </span>
                    </div>
                    <h3 className="blog-card-title">How to Choose the Perfect Watch for Your Lifestyle</h3>
                    <p className="blog-card-excerpt">
                      Choosing the right watch depends on your lifestyle, daily activities, and personal taste. From elegant dress watches to
                      sporty chronographs, discover how to pick a timepiece that fits your life perfectly.
                    </p>
                    <span className="blog-read-more-btn">
                      Read More{' '}
                      <span className="blog-read-more-arrow">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </article>

              <article className="blog-card">
                <Link to="/blog-detail" className="blog-card-link">
                  <div className="blog-card-image">
                    <img src="/assets/img/watch-5.jpg" alt="Caring for Luxury Watches" width="400" height="200" />
                  </div>
                  <div className="blog-card-content">
                    <span className="blog-card-category">Maintenance</span>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>{' '}
                        10:15 AM, 08 Mar 2027
                      </span>
                      <span className="blog-card-comments">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>{' '}
                        Comment (7)
                      </span>
                    </div>
                    <h3 className="blog-card-title">5Essential Watch Care Tips to Keep Your Timepiece Like New</h3>
                    <p className="blog-card-excerpt">
                      Luxury watches deserve proper care. Learn how to store, clean, and maintain your watch to ensure accuracy, longevity, and
                      timeless appearance.
                    </p>
                    <span className="blog-read-more-btn">
                      Read More{' '}
                      <span className="blog-read-more-arrow">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </article>
            </div>

            <nav className="blog-pagination" aria-label="Blog pagination">
              <a href="#" className="blog-pagination-btn blog-pagination-prev" aria-label="Previous">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <a href="#" className="blog-pagination-btn active">
                1
              </a>
              <a href="#" className="blog-pagination-btn">
                2
              </a>
              <a href="#" className="blog-pagination-btn">
                3
              </a>
              <a href="#" className="blog-pagination-btn">
                4
              </a>
              <a href="#" className="blog-pagination-btn">
                5
              </a>
              <a href="#" className="blog-pagination-btn blog-pagination-next" aria-label="Next">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </nav>
          </div>

          <aside className="blog-sidebar">
            <div className="blog-sidebar-widget">
              <div className="blog-sidebar-widget-header">
                <h3 className="blog-sidebar-title">Category</h3>
                <a href="#" className="blog-sidebar-clear">
                  Clear All
                </a>
              </div>
              <div className="blog-category-list">
                <label className="blog-category-item">
                  <input type="checkbox" name="cat" value="thermometers" />
                  <span>
                    Luxury Watches <span className="blog-category-count">(32)</span>
                  </span>
                </label>
                <label className="blog-category-item">
                  <input type="checkbox" name="cat" value="oximeters" />
                  <span>
                    Smart Watches <span className="blog-category-count">(14)</span>
                  </span>
                </label>
                <label className="blog-category-item">
                  <input type="checkbox" name="cat" value="bp-monitors" />
                  <span>
                    Watch Accessories <span className="blog-category-count">(9)</span>
                  </span>
                </label>
                <label className="blog-category-item">
                  <input type="checkbox" name="cat" value="personal-care" />
                  <span>
                    Watch Maintenance <span className="blog-category-count">(6)</span>
                  </span>
                </label>
                <label className="blog-category-item">
                  <input type="checkbox" name="cat" value="luxury-watches" />
                  <span>
                    Watch Technology <span className="blog-category-count">(12)</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="blog-sidebar-widget">
              <h3 className="blog-sidebar-title">Popular Tags</h3>
              <div className="blog-tags">
                <a href="#" className="blog-tag">
                  Luxury Watches
                </a>
                <a href="#" className="blog-tag">
                  Watch Guide
                </a>
                <a href="#" className="blog-tag">
                  Smartwatch
                </a>
                <a href="#" className="blog-tag">
                  Watch Care
                </a>
                <a href="#" className="blog-tag">
                  Timepiece
                </a>
              </div>
            </div>

            <div className="blog-sidebar-widget">
              <h3 className="blog-sidebar-title">Recent Posts</h3>
              <ul className="blog-sidebar-posts">
                <li>
                  <Link to="/blog-detail" className="blog-sidebar-post">
                    <img src="/assets/img/watch-1.jpg" alt="" width="60" height="60" />
                    <div className="blog-sidebar-post-content">
                      <span className="blog-sidebar-post-title">How Automatic Watches Work</span>
                      <span className="blog-sidebar-post-cat">Watch Guide</span>
                      <span className="blog-sidebar-post-meta">09 Feb 2027 • Comment (10)</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

