import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorefrontAuth } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

export const GamingProfilePage = () => {
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
      <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
        <GamingHeader />
        <section style={{ padding: 20 }}>
          <p>Please login first.</p>
          <button type="button" onClick={() => navigate('/auth/login')}>
            Go to Login
          </button>
        </section>
        <GamingFooter />
      </main>
    );
  }

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    await updateUser(user._id, { firstName, lastName, phoneNumber });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ maxWidth: 560, margin: '30px auto', border: '1px solid #2b3648', padding: 16 }}>
        <h1>Profile</h1>
        <form onSubmit={(e) => void onSave(e)} style={{ display: 'grid', gap: 10 }}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" />
          <button type="submit" disabled={loading} style={{ background: '#7cf7b1', border: 0, padding: 10 }}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>
      <GamingFooter />
    </main>
  );
};
