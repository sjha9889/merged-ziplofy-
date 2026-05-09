import { Link } from 'react-router-dom';

/** React fallback when the theme does not provide a Liquid article template. */
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
        <article className="blog-detail-content">
          <h1 className="blog-detail-title">Article</h1>
          <p className="text-neutral-600">Open a post from the blog listing, or use a theme that renders articles from the server.</p>
          <p className="mt-4">
            <Link to="/blog">← Back to blog</Link>
          </p>
        </article>
      </div>
    </main>
  );
}
