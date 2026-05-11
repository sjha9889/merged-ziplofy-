import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useStorefrontAuth, useStorefrontCart } from '@render-store/sdk';
import { B } from './beautyTokens';

export const BeautyHeader = () => {
  const { user, logout } = useStorefrontAuth();
  const { getAllItems } = useStorefrontCart();
  const cartCount = getAllItems().reduce((sum, item) => sum + item.quantity, 0);

  const link: CSSProperties = {
    color: B.ink,
    textDecoration: 'none',
    fontFamily: B.sans,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.02em',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        background: 'rgba(250, 248, 246, 0.88)',
        borderBottom: `1px solid ${B.line}`,
        padding: '16px 28px',
        boxShadow: B.shadowSm,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: B.serif,
              fontSize: 28,
              fontWeight: 600,
              color: B.ink,
              letterSpacing: '0.04em',
            }}
          >
            Lumière
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: B.sans,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: B.roseDeep,
              marginTop: 2,
            }}
          >
            Beauty Atelier
          </span>
        </Link>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Link to="/" style={link}>
            Home
          </Link>
          <Link to="/my-orders" style={link}>
            Orders
          </Link>
          <Link to="/profile" style={link}>
            Profile
          </Link>
          <Link to="/preferences" style={link}>
            Preferences
          </Link>
          <Link
            to="/cart"
            style={{
              fontFamily: B.sans,
              fontSize: 13,
              color: B.inkMuted,
              padding: '8px 14px',
              borderRadius: 999,
              border: `1px solid ${B.line}`,
              background: B.white,
              textDecoration: 'none',
            }}
          >
            Bag · <strong style={{ color: B.roseDeep, fontWeight: 600 }}>{cartCount}</strong>
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => void logout()}
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: `linear-gradient(135deg, ${B.rose} 0%, ${B.roseDeep} 100%)`,
                color: B.white,
                border: 'none',
                padding: '10px 18px',
                borderRadius: 999,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(167, 93, 106, 0.35)',
              }}
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                to="/auth/login"
                style={{
                  ...link,
                  color: B.roseDeep,
                  borderBottom: `2px solid ${B.roseLight}`,
                  paddingBottom: 2,
                }}
              >
                Sign in
              </Link>
              <Link to="/auth/signup" style={{ ...link, color: B.gold, fontWeight: 600 }}>
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
