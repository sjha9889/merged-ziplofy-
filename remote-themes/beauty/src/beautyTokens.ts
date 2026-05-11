import type { CSSProperties } from 'react';

/** Shared palette + typography for the beauty theme (Cormorant + Outfit via theme.css). */
export const B = {
  cream: '#faf8f6',
  blush: '#fdf4f6',
  rose: '#c77b86',
  roseDeep: '#a85d6a',
  roseLight: '#e8b4bc',
  gold: '#b8975c',
  goldSoft: '#d4c4a0',
  ink: '#1f1719',
  inkMuted: '#5c5154',
  white: '#ffffff',
  line: 'rgba(199, 123, 134, 0.18)',
  shadow: '0 20px 50px rgba(31, 23, 25, 0.08)',
  shadowSm: '0 8px 24px rgba(31, 23, 25, 0.06)',
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Outfit', system-ui, -apple-system, sans-serif",
} as const;

export const inputStyle: CSSProperties = {
  fontFamily: B.sans,
  fontSize: 15,
  padding: '14px 16px',
  border: `1px solid ${B.line}`,
  borderRadius: B.radiusSm,
  background: B.white,
  color: B.ink,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
