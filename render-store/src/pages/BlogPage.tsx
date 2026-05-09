import { Link } from 'react-router-dom';

/** React fallback when the theme does not provide a Liquid blog template. */
export function BlogPage() {
  return (
    <main className="blog-page">
      <div className="blog-inner">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="blog-breadcrumb-sep">•</span>
          <span className="blog-breadcrumb-current">Blog</span>
        </nav>
        <header className="blog-header">
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">Updates and articles from this store will appear here when published.</p>
        </header>
        <div className="blog-layout">
          <div className="blog-main">
            <p className="text-neutral-600">No posts yet.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
