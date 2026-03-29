import { Link } from 'react-router-dom'

export function BlogDetailPage() {
  return (
    <main className="blog-detail-page">
      <div className="blog-detail-inner">
        <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="blog-detail-breadcrumb-sep">•</span>
          <Link to="/blog">Blog</Link>
          <span className="blog-detail-breadcrumb-sep">•</span>
          <span className="blog-detail-breadcrumb-current">Article</span>
        </nav>

        <section className="blog-detail-hero">
          <div className="blog-detail-hero-image">
            <img
              src="/assets/img/banner-1.png"
              alt="Why Online Shopping Is the Future of Retail"
              width="1200"
              height="420"
            />
          </div>
          <div className="blog-detail-overlay-card">
            <span className="blog-detail-category">Watch Guide</span>
            <h1 className="blog-detail-title">How to Choose the Perfect Luxury Watch for Your Style</h1>
            <div className="blog-detail-meta">
              <span className="blog-detail-meta-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                By Chronova Editorial
              </span>
              <span className="blog-detail-meta-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                12 Mar 2026
              </span>
              <span className="blog-detail-meta-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Comment (12)
              </span>
            </div>
          </div>
        </section>

        <article className="blog-detail-content">
          <div className="blog-detail-body">
            <p>
              A watch is more than just a device to tell time. It represents personality, craftsmanship, and personal style. For many
              people, choosing the right watch is an important decision because it becomes a part of their everyday life.
            </p>
            <p>
              Whether you prefer classic mechanical watches or modern smart timepieces, understanding the different styles, materials, and
              movements will help you find the perfect watch that complements your lifestyle.
            </p>

            <h2 className="blog-detail-heading">Understanding Different Types of Watches</h2>
            <p>
              Whether you prefer classic mechanical watches or modern smart timepieces, understanding the different styles, materials, and
              movements will help you find the perfect watch that complements your lifestyle.
            </p>

            <div className="blog-detail-image-grid">
              <img src="/assets/img/watch-1.jpg" alt="Premium chronograph watch" width="580" height="300" />
              <img src="/assets/img/watch-2.jpg" alt="Elegant automatic watch" width="580" height="300" />
            </div>

            <blockquote className="blog-detail-quote">
              <span className="blog-detail-quote-mark">"</span>
              A luxury watch is not just about telling time — it tells a story of craftsmanship, heritage, and timeless design.
              <span className="blog-detail-quote-mark">"</span>
            </blockquote>

            <h2 className="blog-detail-heading">Choosing the Right Watch for Every Occasion</h2>
            <p>
              The perfect watch should match both your wardrobe and the occasion. A leather strap watch pairs beautifully with formal
              attire, while stainless steel or rubber straps are better suited for casual or sports activities.
            </p>
            <p>
              When selecting a watch, also consider the case size, dial design, and movement type. A well-chosen timepiece not only
              enhances your look but also reflects your personality and taste.
            </p>
          </div>

          <footer className="blog-detail-footer">
            <div className="blog-detail-tags">
              <a href="#" className="blog-detail-tag">
                Luxury Watches
              </a>
              <a href="#" className="blog-detail-tag">
                Watch Guide
              </a>
              <a href="#" className="blog-detail-tag">
                Watch Style
              </a>
              <a href="#" className="blog-detail-tag">
                Timepieces
              </a>
            </div>
            <div className="blog-detail-share">
              <a href="#" className="blog-detail-share-icon blog-detail-share-fb" aria-label="Share on Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="blog-detail-share-icon blog-detail-share-ig" aria-label="Share on Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="blog-detail-share-icon blog-detail-share-in" aria-label="Share on LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="blog-detail-share-icon blog-detail-share-tw" aria-label="Share on Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </footer>
        </article>

        <section className="blog-comments-section">
          <div className="blog-comments-header">
            <h2 className="blog-comments-title">Comments</h2>
            <div className="blog-comments-sort">
              <select className="blog-comments-sort-select" aria-label="Sort comments" defaultValue="Sorting">
                <option>Sorting</option>
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <ul className="blog-comments-list">
            <li className="blog-comment-item">
              <div className="blog-comment-avatar">
                <img
                  src="https://ui-avatars.com/api/?name=Robert+Fox&background=e5e7eb&color=374151&size=80"
                  alt="Robert Fox"
                  width="80"
                  height="80"
                />
              </div>
              <div className="blog-comment-body">
                <div className="blog-comment-header">
                  <span className="blog-comment-name">Robert Fox</span>
                  <a href="#" className="blog-comment-reply">
                    Reply
                  </a>
                </div>
                <span className="blog-comment-date">12:40PM, 14 Nov, 2026</span>
                <p className="blog-comment-text">
                  Great article! I recently started collecting watches and this guide helped me understand the differences between automatic
                  and quartz watches. Looking forward to more posts like this.
                </p>
              </div>
            </li>
          </ul>

          <div className="blog-add-comment">
            <h3 className="blog-add-comment-title">Add Comment</h3>
            <form className="blog-add-comment-form" action="#" method="post" aria-label="Add comment form">
              <div className="blog-add-comment-field">
                <textarea id="comment-text" name="comment" rows={6} placeholder="Comment *" required></textarea>
              </div>
              <div className="blog-add-comment-row">
                <div className="blog-add-comment-field">
                  <input type="text" id="comment-name" name="name" placeholder="Name *" required />
                </div>
                <div className="blog-add-comment-field">
                  <input type="email" id="comment-email" name="email" placeholder="Email *" required />
                </div>
              </div>
              <div className="blog-add-comment-actions">
                <button type="submit" className="blog-add-comment-btn">
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="blog-related-section">
          <div className="blog-related-header">
            <h2 className="blog-related-title">Related Articles</h2>
            <div className="blog-related-nav">
              <button type="button" className="blog-related-btn blog-related-prev" aria-label="Previous">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" className="blog-related-btn blog-related-next" aria-label="Next">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="blog-related-slider">
            <div className="blog-related-track" id="related-track">
              <article className="blog-related-card">
                <Link to="/blog-detail" className="blog-related-card-link">
                  <div className="blog-related-card-image">
                    <img src="/assets/img/watch-1.jpg" alt="Luxury Watch Guide" width="280" height="200" />
                  </div>
                  <div className="blog-related-card-content">
                    <span className="blog-related-card-category">Luxury Watches</span>
                    <div className="blog-related-card-meta">
                      <span className="blog-related-card-date">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        12 Jan 2026
                      </span>
                      <span className="blog-related-card-comments">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Comment (18)
                      </span>
                    </div>
                    <h3 className="blog-related-card-title">Top 10 Luxury Watches Every Collector Should Know</h3>
                    <p className="blog-related-card-excerpt">
                      Discover the finest luxury watches that combine craftsmanship, prestige, and timeless design.
                    </p>
                    <span className="blog-related-read-more">
                      Read More
                      <span className="blog-related-read-more-arrow">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

