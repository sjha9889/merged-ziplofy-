import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorefront, useStorefrontAuth } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B, inputStyle } from './beautyTokens';

export const BeautySignupPage = () => {
  const { signup, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeFrontMeta?.storeId) return;
    await signup({ storeId: storeFrontMeta.storeId, firstName, lastName, email, password });
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
            Join the atelier
          </p>
          <h1 style={{ fontFamily: B.serif, fontSize: 32, fontWeight: 600, margin: '0 0 28px' }}>Create account</h1>
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'grid', gap: 18 }}>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" style={inputStyle} />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" style={inputStyle} />
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
                background: loading ? '#c4bbb8' : `linear-gradient(135deg, ${B.ink} 0%, #3d2f33 100%)`,
                color: B.white,
                border: 'none',
                padding: '16px 24px',
                borderRadius: 999,
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : B.shadow,
              }}
            >
              {loading ? 'Please wait…' : 'Create account'}
            </button>
          </form>
          <p style={{ fontFamily: B.sans, fontSize: 14, marginTop: 24, color: B.inkMuted }}>
            Already a member?{' '}
            <Link to="/auth/login" style={{ color: B.roseDeep, fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
