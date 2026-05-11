import { Link } from 'react-router-dom';
import { B } from './beautyTokens';

export const BeautyHeroSection = () => {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 28px',
        background: `
          radial-gradient(ellipse 80% 60% at 70% 20%, rgba(232, 180, 188, 0.45) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 15% 80%, rgba(184, 151, 92, 0.12) 0%, transparent 50%),
          linear-gradient(165deg, ${B.cream} 0%, ${B.blush} 50%, #f5ebe8 100%)
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '8% 12% auto auto',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `linear-gradient(135deg, rgba(255,255,255,0.5), rgba(199,123,134,0.08))`,
          filter: 'blur(1px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 720, textAlign: 'center' }}>
        <p
          style={{
            fontFamily: B.sans,
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: B.roseDeep,
            margin: '0 0 16px',
            fontWeight: 600,
          }}
        >
          New season · luminous skin
        </p>
        <h1
          style={{
            fontFamily: B.serif,
            fontWeight: 600,
            fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
            lineHeight: 1.12,
            color: B.ink,
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
          }}
        >
          Rituals that feel like{' '}
          <span style={{ fontStyle: 'italic', color: B.roseDeep }}>self-portraits</span>
        </h1>
        <p
          style={{
            fontFamily: B.sans,
            fontSize: 18,
            lineHeight: 1.7,
            color: B.inkMuted,
            margin: '0 auto 32px',
            maxWidth: 520,
            fontWeight: 400,
          }}
        >
          Editorial textures, soft light, and products your customers already love — wrapped in an atelier-grade storefront experience.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/auth/signup"
            style={{
              fontFamily: B.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: B.white,
              background: `linear-gradient(135deg, ${B.ink} 0%, #3d2f33 100%)`,
              padding: '16px 32px',
              borderRadius: 999,
              boxShadow: B.shadow,
            }}
          >
            Begin your ritual
          </Link>
          <Link
            to="/"
            style={{
              fontFamily: B.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: B.roseDeep,
              padding: '16px 28px',
              borderRadius: 999,
              border: `1px solid ${B.line}`,
              background: B.white,
            }}
          >
            Shop the edit
          </Link>
        </div>
      </div>
    </section>
  );
};
