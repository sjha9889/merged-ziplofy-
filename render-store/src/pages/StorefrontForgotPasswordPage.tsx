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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
        <h1 className="text-xl font-extrabold text-gray-900">Forgot password</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-gray-900">Email</span>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
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
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
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


