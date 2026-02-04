import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { signup, loading, user} = useStorefrontAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  return (
    <SlantedImageCarouselWrapper>
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <h1 className="text-xl font-extrabold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-600">Join us and start shopping.</p>

          <div className="mt-6 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-900">First name</span>
                <input className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-900">Last name</span>
                <input className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-900">Email</span>
              <input className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-900">Password</span>
              <input className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (!storeFrontMeta?.storeId) return;
                await signup({ storeId: storeFrontMeta.storeId, firstName, lastName, email, password });
              }}
              className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Create account
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
              Sign up with Google
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/auth/login')}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlantedImageCarouselWrapper>
  );
};

export default StorefrontSignupPage;


