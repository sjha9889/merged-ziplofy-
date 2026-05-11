import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorefront, useStorefrontAuth } from '@render-store/sdk';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';

export const GamingSignupPage = () => {
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
    <main style={{ minHeight: '100vh', background: '#030712', color: '#f3f3f3' }}>
      <GamingHeader />
      <section style={{ maxWidth: 420, margin: '40px auto', border: '1px solid #2b3648', padding: 16 }}>
        <h1>Signup</h1>
        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'grid', gap: 10 }}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="submit" disabled={loading} style={{ background: '#7cf7b1', border: 0, padding: 10 }}>
            {loading ? 'Please wait...' : 'Create Account'}
          </button>
        </form>
        <p>
          <Link to="/auth/login" style={{ color: '#7cf7b1' }}>
            Already have account?
          </Link>
        </p>
      </section>
      <GamingFooter />
    </main>
  );
};
