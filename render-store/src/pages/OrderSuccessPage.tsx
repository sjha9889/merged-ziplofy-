import { Link } from 'react-router-dom';

export function OrderSuccessPage() {
  return (
    <main>
      <section className="order-success-hero">
        <div className="order-success-inner">
          <nav className="order-success-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="order-success-breadcrumb-sep">•</span>
            <span>Checkout</span>
          </nav>
          <div className="order-success-hero-illustration">
            <div className="order-success-hero-shape">
              <svg width="70" height="70" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="order-success-hero-dots" aria-hidden="true">
              <span className="dot-blue dot1"></span>
              <span className="dot-blue dot2"></span>
              <span className="dot-blue dot3"></span>
              <span className="dot-red dot4"></span>
              <span className="dot-leaf leaf1"></span>
              <span className="dot-leaf leaf2"></span>
            </div>
          </div>
          <h1 className="order-success-title">Thanks For Your Order</h1>
          <p className="order-success-text">
            We&apos;re excited to let you know that we&apos;ve received your order and it&apos;s now being processed.
          </p>
          <Link to="/" className="order-success-btn">Back To Home</Link>
        </div>
      </section>
    </main>
  );
}
