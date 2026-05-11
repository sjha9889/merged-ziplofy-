import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorefront, useStorefrontAuth } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B, inputStyle } from './beautyTokens';

export const BeautyLoginPage = () => {
  const { login, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeFrontMeta?.storeId) return;
    await login({ storeId: storeFrontMeta.storeId, email, password });
    navigate('/');
  };

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ padding: '48px 28px 80px' }}>
        <div
          style={{
            maxWidth: 440,
            margin: '0 auto',
            background: B.white,
            borderRadius: B.radiusLg,
            padding: '44px 40px',
            border: `1px solid ${B.line}`,
            boxShadow: B.shadow,
          }}
        >
          <p
            style={{
              fontFamily: B.sans,
              fontSize: 11,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: B.roseDeep,
              margin: '0 0 10px',
              fontWeight: 600,
            }}
          >
            Welcome back
          </p>
          <h1 style={{ fontFamily: B.serif, fontSize: 32, fontWeight: 600, margin: '0 0 28px' }}>Sign in</h1>
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'grid', gap: 18 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyle} />
            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 8,
                background: loading ? '#c4bbb8' : `linear-gradient(135deg, ${B.rose} 0%, ${B.roseDeep} 100%)`,
                color: B.white,
                border: 'none',
                padding: '16px 24px',
                borderRadius: 999,
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 10px 28px rgba(167, 93, 106, 0.3)',
              }}
            >
              {loading ? 'Please wait…' : 'Continue'}
            </button>
          </form>
          <p style={{ fontFamily: B.sans, fontSize: 14, marginTop: 24, color: B.inkMuted }}>
            New here?{' '}
            <Link to="/auth/signup" style={{ color: B.roseDeep, fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
