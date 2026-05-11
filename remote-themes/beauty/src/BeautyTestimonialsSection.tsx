import { B } from './beautyTokens';

const testimonials = [
  { id: 't1', name: 'Elena V.', role: 'Editor', quote: 'The cart flow feels effortless — like unboxing something precious.' },
  { id: 't2', name: 'Noor A.', role: 'Stylist', quote: 'Orders and profile stayed intuitive; the skin of the store finally matches the brand.' },
  { id: 't3', name: 'Sofia M.', role: 'Founder', quote: 'We swapped themes without touching our backend. That alone is worth the glow-up.' },
];

export const BeautyTestimonialsSection = () => {
  return (
    <section style={{ padding: '72px 28px', background: B.cream }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: B.sans,
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: B.gold,
            margin: '0 0 12px',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Voices
        </p>
        <h2
          style={{
            fontFamily: B.serif,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: B.ink,
            textAlign: 'center',
            margin: '0 0 48px',
          }}
        >
          Loved in the mirror and in the inbox
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {testimonials.map((item) => (
            <article
              key={item.id}
              style={{
                background: B.white,
                borderRadius: B.radiusLg,
                padding: '32px 28px',
                border: `1px solid ${B.line}`,
                boxShadow: B.shadowSm,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${B.roseLight}, ${B.goldSoft})`,
                }}
              />
              <p
                style={{
                  fontFamily: B.serif,
                  fontSize: 20,
                  fontStyle: 'italic',
                  lineHeight: 1.55,
                  color: B.ink,
                  margin: '8px 0 24px',
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(145deg, ${B.blush}, ${B.roseLight})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: B.serif,
                    fontSize: 18,
                    color: B.roseDeep,
                    fontWeight: 600,
                  }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: B.sans, fontWeight: 600, color: B.ink, fontSize: 15 }}>{item.name}</p>
                  <p style={{ margin: '4px 0 0', fontFamily: B.sans, fontSize: 12, color: B.inkMuted, letterSpacing: '0.06em' }}>{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
