import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { login, loading } = useStorefrontAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SlantedImageCarouselWrapper>
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-lg bg-[#fefcf8]/95 p-6 shadow-lg border border-[#e8e0d5]/60 backdrop-blur">
          <h1 className="text-xl font-extrabold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>Login</h1>
          <p className="mt-1 text-sm text-[#2b1e1e]">Welcome back! Please sign in to continue.</p>

          <div className="mt-6 space-y-3">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-[#0c100c]">Email</span>
              <input
                className="w-full rounded-lg border border-[#e8e0d5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-[#0c100c]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-[#0c100c]">Password</span>
              <input
                className="w-full rounded-lg border border-[#e8e0d5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-[#0c100c]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (!storeFrontMeta?.storeId) return;
                await login({ storeId: storeFrontMeta.storeId, email, password });
              }}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] px-4 py-2 text-sm font-semibold text-[#0c100c] hover:shadow-lg disabled:opacity-50 transition-all"
              style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
            >
              Sign in
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-[#e8e0d5]" />
              <span className="text-xs text-[#2b1e1e]">or</span>
              <div className="h-px flex-1 bg-[#e8e0d5]" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e8e0d5] bg-white px-4 py-2 text-sm font-semibold text-[#0c100c] hover:bg-[#f5f1e8] transition-colors"
            >
              <FcGoogle />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => navigate('/auth/forgot-password')}
              className="w-full text-center text-sm font-medium text-[#d4af37] hover:text-[#b8941f] transition-colors"
            >
              Forgot password?
            </button>

            <div className="text-center text-sm text-[#2b1e1e]">
              Don&apos;t have an account?{' '}
              <button type="button" className="font-semibold text-[#d4af37] hover:text-[#b8941f] transition-colors" onClick={() => navigate('/auth/signup')}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlantedImageCarouselWrapper>
  );
};

export default StorefrontLoginPage;


