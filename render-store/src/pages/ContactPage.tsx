import { Link } from 'react-router-dom';

export function ContactPage() {
  return (
    <>
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
            <Link to="/">Home</Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="contact-card-title">Email</h3>
              <p className="contact-card-text">support@example.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-4a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
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
                      <input type="text" name="first_name" placeholder="First Name" required />
                    </div>
                    <div className="contact-form-group">
                      <input type="text" name="last_name" placeholder="Last Name" required />
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <input type="tel" name="phone" placeholder="Phone Number" required />
                    </div>
                    <div className="contact-form-group">
                      <input type="email" name="email" placeholder="Email Address" required />
                    </div>
                  </div>
                  <div className="contact-form-group">
                    <input type="text" name="subject" placeholder="Subject" />
                  </div>
                  <div className="contact-form-group">
                    <textarea name="message" rows={5} placeholder="Write your message" required></textarea>
                  </div>
                  <div className="contact-form-actions">
                    <button type="submit" className="contact-form-submit">Send Your Message</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
