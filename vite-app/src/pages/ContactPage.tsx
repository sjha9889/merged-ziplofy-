import { Link } from 'react-router-dom'

export function ContactPage() {
  return (
    <>
      {/* SVG clip-path for contact form wavy shape */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="contact-form-wave" clipPathUnits="objectBoundingBox">
            <path d="M0,0.06 C0.2,0.02 0.4,0.08 0.5,0.04 0.6,0.08 0.8,0.02 1,0.06 L1,0.94 C0.8,0.98 0.6,0.92 0.5,0.96 0.4,0.92 0.2,0.98 0,0.94 Z" />
          </clipPath>
        </defs>
      </svg>

      <main className="contact-page">
        <div className="contact-inner">
          <nav className="contact-breadcrumb" aria-label="Breadcrumb">
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
            <span className="contact-breadcrumb-sep">•</span>
            <span className="contact-breadcrumb-current">Contact us</span>
          </nav>

          <div className="contact-hero">
            <h1 className="contact-title">We are happy to assist you</h1>
            <p className="contact-subtitle">Here to help, anytime you need us.</p>
          </div>

          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="contact-card-title">Email</h3>
              <p className="contact-card-text">support@example.com</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-4a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="contact-card-title">Phone</h3>
              <p className="contact-card-text">+1 (555) 123-4567</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="contact-card-title">Address</h3>
              <p className="contact-card-text">123 Innovation Street, Suite 456, San Francisco, CA 94107, USA</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="contact-card-title">Website</h3>
              <p className="contact-card-text">www.createuiux.com</p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <section className="contact-form-section">
            <div className="contact-form-section-inner">
              <h2 className="contact-form-heading">Contact Us</h2>
              <p className="contact-form-subheading">We&apos;d love to hear from you!</p>
              <div className="contact-form-card">
                <form className="contact-form-fields" action="#" method="post" aria-label="Contact form">
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <input type="text" id="first-name" name="first_name" placeholder="First Name" required />
                    </div>
                    <div className="contact-form-group">
                      <input type="text" id="last-name" name="last_name" placeholder="Last Name" required />
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <input type="tel" id="phone" name="phone" placeholder="Phone Number" required />
                    </div>
                    <div className="contact-form-group">
                      <input type="email" id="email" name="email" placeholder="Email Address" required />
                    </div>
                  </div>
                  <div className="contact-form-group">
                    <input type="text" id="subject" name="subject" placeholder="Subject" />
                  </div>
                  <div className="contact-form-group">
                    <textarea id="message" name="message" rows={5} placeholder="Write your message" required></textarea>
                  </div>
                  <div className="contact-form-actions">
                    <button type="submit" className="contact-form-submit">
                      Send Your Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>

        <section className="faq-section">
          <div className="faq-inner">
            <h2 className="faq-heading">Frequently Asked Questions</h2>
            <p className="faq-subheading">Find quick answers to common questions.</p>
            <div className="faq-accordion" role="region" aria-label="FAQ accordion">
              <div className="faq-item is-open" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="true"
                  aria-controls="faq-answer-1"
                  id="faq-question-1"
                  data-faq-trigger
                >
                  <span className="faq-number">1.</span>
                  <span className="faq-question-text">What payment methods do you accept?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-1" role="region" aria-labelledby="faq-question-1" data-faq-content>
                  <p>
                    We&apos;re always here to help you. Whether you have a question, need support, or just want to learn more about our
                    services, our team is ready to assist you every step of the way.
                  </p>
                </div>
              </div>

              <div className="faq-item" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="false"
                  aria-controls="faq-answer-2"
                  id="faq-question-2"
                  data-faq-trigger
                >
                  <span className="faq-number">2.</span>
                  <span className="faq-question-text">How can I track my order?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-2" role="region" aria-labelledby="faq-question-2" data-faq-content>
                  <p>
                    Once your order ships, you&apos;ll receive an email with a tracking number and link. You can also track your order by
                    logging into your account and visiting the Order History section.
                  </p>
                </div>
              </div>

              <div className="faq-item" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="false"
                  aria-controls="faq-answer-3"
                  id="faq-question-3"
                  data-faq-trigger
                >
                  <span className="faq-number">3.</span>
                  <span className="faq-question-text">How long will it take to receive my order?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-3" role="region" aria-labelledby="faq-question-3" data-faq-content>
                  <p>
                    Standard domestic shipping typically takes 5-7 business days. Express options are available at checkout for faster
                    delivery. International orders may take 10-14 business days depending on destination.
                  </p>
                </div>
              </div>

              <div className="faq-item" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="false"
                  aria-controls="faq-answer-4"
                  id="faq-question-4"
                  data-faq-trigger
                >
                  <span className="faq-number">4.</span>
                  <span className="faq-question-text">Do you ship internationally?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-4" role="region" aria-labelledby="faq-question-4" data-faq-content>
                  <p>
                    Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location. You can see the exact
                    cost at checkout before completing your purchase.
                  </p>
                </div>
              </div>

              <div className="faq-item" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="false"
                  aria-controls="faq-answer-5"
                  id="faq-question-5"
                  data-faq-trigger
                >
                  <span className="faq-number">5.</span>
                  <span className="faq-question-text">Can I cancel or modify my order?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-5" role="region" aria-labelledby="faq-question-5" data-faq-content>
                  <p>
                    You may cancel or modify your order within 1 hour of placing it. After that, if your order has already shipped, please
                    refer to our Returns &amp; Exchanges policy for assistance.
                  </p>
                </div>
              </div>

              <div className="faq-item" data-faq-item>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded="false"
                  aria-controls="faq-answer-6"
                  id="faq-question-6"
                  data-faq-trigger
                >
                  <span className="faq-number">6.</span>
                  <span className="faq-question-text">Do I need an account to place an order?</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg className="faq-icon-minus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                    <svg className="faq-icon-plus" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer" id="faq-answer-6" role="region" aria-labelledby="faq-question-6" data-faq-content>
                  <p>
                    No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, and access
                    exclusive offers. Registration is quick and free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        id="contact-scroll-top"
        className="contact-scroll-top-btn"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  )
}

