import { Link } from 'react-router-dom';

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
            <img src="/assets/img/banner-1.png" alt="Article" width="1200" height="420" />
          </div>
          <div className="blog-detail-overlay-card">
            <span className="blog-detail-category">Watch Guide</span>
            <h1 className="blog-detail-title">How to Choose the Perfect Luxury Watch for Your Style</h1>
            <div className="blog-detail-meta">
              <span className="blog-detail-meta-item">By Chronova Editorial</span>
              <span className="blog-detail-meta-item">12 Mar 2026</span>
              <span className="blog-detail-meta-item">Comment (12)</span>
            </div>
          </div>
        </section>
        <article className="blog-detail-content">
          <div className="blog-detail-body">
            <p>A watch is more than just a device to tell time. It represents personality, craftsmanship, and personal style.</p>
            <p>Whether you prefer classic mechanical watches or modern smart timepieces, understanding the different styles will help you find the perfect watch.</p>
            <h2 className="blog-detail-heading">Understanding Different Types of Watches</h2>
            <p>Understanding the different styles, materials, and movements will help you find the perfect watch that complements your lifestyle.</p>
            <div className="blog-detail-image-grid">
              <img src="/assets/img/watch-1.jpg" alt="Premium chronograph watch" width="580" height="300" />
              <img src="/assets/img/watch-2.jpg" alt="Elegant automatic watch" width="580" height="300" />
            </div>
            <blockquote className="blog-detail-quote">
              A luxury watch is not just about telling time — it tells a story of craftsmanship, heritage, and timeless design.
            </blockquote>
          </div>
          <footer className="blog-detail-footer">
            <div className="blog-detail-tags">
              <a href="#" className="blog-detail-tag">Luxury Watches</a>
              <a href="#" className="blog-detail-tag">Watch Guide</a>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
