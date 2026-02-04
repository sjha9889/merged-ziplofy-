import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { login, loading,user } = useStorefrontAuth();


  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SlantedImageCarouselWrapper>
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <h1 className="text-xl font-extrabold text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back! Please sign in to continue.</p>

          <div className="mt-6 space-y-3">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-900">Email</span>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-900">Password</span>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
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
              className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Sign in
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              <FcGoogle />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => navigate('/auth/forgot-password')}
              className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </button>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/auth/signup')}>
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


