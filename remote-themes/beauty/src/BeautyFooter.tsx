import { Link } from 'react-router-dom';
import { B } from './beautyTokens';

export const BeautyFooter = () => {
  return (
    <footer
      style={{
        marginTop: 80,
        background: `linear-gradient(180deg, ${B.blush} 0%, ${B.cream} 45%, #f0ebe6 100%)`,
        borderTop: `1px solid ${B.line}`,
        padding: '56px 28px 40px',
        color: B.inkMuted,
        fontFamily: B.sans,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: B.serif,
              fontSize: 26,
              color: B.ink,
              margin: '0 0 12px',
              fontWeight: 600,
            }}
          >
            Lumière
          </p>
          <p style={{ margin: 0, lineHeight: 1.65, fontSize: 14 }}>
            Curated skincare, color, and fragrance — presented with the same care you give your ritual.
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: B.roseDeep, margin: '0 0 14px', fontWeight: 600 }}>
            Explore
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <Link to="/" style={{ color: B.ink, textDecoration: 'none', fontSize: 14 }}>
              Boutique
            </Link>
            <Link to="/my-orders" style={{ color: B.ink, textDecoration: 'none', fontSize: 14 }}>
              Orders
            </Link>
            <Link to="/preferences" style={{ color: B.ink, textDecoration: 'none', fontSize: 14 }}>
              Preferences
            </Link>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: B.roseDeep, margin: '0 0 14px', fontWeight: 600 }}>
            Care
          </p>
          <p style={{ margin: 0, lineHeight: 1.65, fontSize: 14 }}>Complimentary samples on qualifying orders. Carbon-neutral shipping where available.</p>
        </div>
      </div>
      <p
        style={{
          textAlign: 'center',
          margin: '48px 0 0',
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: B.inkMuted,
        }}
      >
        Beauty theme · powered by render-store
      </p>
    </footer>
  );
};
