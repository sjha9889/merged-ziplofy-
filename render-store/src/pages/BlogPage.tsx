import { Link } from 'react-router-dom';

export function BlogPage() {
  return (
    <main className="blog-page">
      <div className="blog-inner">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
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
              <button type="button" className="blog-view-btn" data-view="list" aria-label="List view">List</button>
              <button type="button" className="blog-view-btn active" data-view="grid" aria-label="Grid view">Grid</button>
            </div>
          </div>
          <div className="blog-topbar-right">
            <select className="blog-sort-select" aria-label="Sort posts" defaultValue="Sorting">
              <option>Sorting</option>
            </select>
            <div className="blog-search-wrap">
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
                    <h3 className="blog-card-title">How to Choose the Perfect Watch for Your Lifestyle</h3>
                    <p className="blog-card-excerpt">Choosing the right watch depends on your lifestyle and personal taste.</p>
                  </div>
                </Link>
              </article>
            </div>
          </div>
          <aside className="blog-sidebar">
            <div className="blog-sidebar-widget">
              <h3 className="blog-sidebar-title">Category</h3>
              <div className="blog-category-list">
                <label className="blog-category-item"><input type="checkbox" /> Luxury Watches</label>
                <label className="blog-category-item"><input type="checkbox" /> Smart Watches</label>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
