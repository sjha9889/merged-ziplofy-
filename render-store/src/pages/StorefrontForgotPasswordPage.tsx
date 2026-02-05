import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';

const StorefrontForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !storeFrontMeta?.storeId) return;
    
    try {
      await forgotPassword({ 
        email: email.trim(),
        storeId: storeFrontMeta.storeId
      });
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <div className="min-h-screen bg-[#fefcf8] px-4 py-10 flex items-center justify-center">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white border border-[#e8e0d5] p-6 shadow-lg">
        <h1 className="text-xl font-extrabold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>Forgot password</h1>
        <p className="mt-1 text-sm text-[#2b1e1e]">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-[#0c100c]">Email</span>
            <input
              className="w-full rounded-lg border border-[#e8e0d5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-[#0c100c]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] px-4 py-2 text-sm font-semibold text-[#0c100c] hover:shadow-lg disabled:opacity-50 transition-all"
            style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#2b1e1e]">
          Remember your password?{' '}
          <button
            type="button"
            className="font-semibold text-[#d4af37] hover:text-[#b8941f] transition-colors"
            onClick={() => navigate('/auth/login')}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorefrontForgotPasswordPage;


