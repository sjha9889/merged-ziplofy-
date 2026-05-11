import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorefrontAuth } from '@render-store/sdk';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { B, inputStyle } from './beautyTokens';

export const BeautyProfilePage = () => {
  const { user, checkAuth, updateUser, loading } = useStorefrontAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setPhoneNumber(user.phoneNumber || '');
  }, [user]);

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
        <BeautyHeader />
        <section style={{ padding: '48px 28px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: B.sans, fontSize: 16, color: B.inkMuted }}>Please sign in to view your profile.</p>
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            style={{
              marginTop: 20,
              fontFamily: B.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, ${B.rose} 0%, ${B.roseDeep} 100%)`,
              color: B.white,
              border: 'none',
              padding: '14px 28px',
              borderRadius: 999,
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </section>
        <BeautyFooter />
      </main>
    );
  }

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    await updateUser(user._id, { firstName, lastName, phoneNumber });
  };

  return (
    <main style={{ minHeight: '100vh', background: B.cream, color: B.ink }}>
      <BeautyHeader />
      <section style={{ padding: '48px 28px 80px' }}>
        <div
          style={{
            maxWidth: 520,
            margin: '0 auto',
            background: B.white,
            borderRadius: B.radiusLg,
            padding: '40px 36px',
            border: `1px solid ${B.line}`,
            boxShadow: B.shadowSm,
          }}
        >
          <h1 style={{ fontFamily: B.serif, fontSize: 32, fontWeight: 600, margin: '0 0 8px' }}>Profile</h1>
          <p style={{ fontFamily: B.sans, fontSize: 14, color: B.inkMuted, margin: '0 0 28px' }}>Keep your details current for a seamless checkout.</p>
          <form onSubmit={(e) => void onSave(e)} style={{ display: 'grid', gap: 18 }}>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" style={inputStyle} />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" style={inputStyle} />
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" style={inputStyle} />
            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: B.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 8,
                background: loading ? '#c4bbb8' : `linear-gradient(135deg, ${B.rose} 0%, ${B.roseDeep} 100%)`,
                color: B.white,
                border: 'none',
                padding: '14px 24px',
                borderRadius: 999,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      </section>
      <BeautyFooter />
    </main>
  );
};
