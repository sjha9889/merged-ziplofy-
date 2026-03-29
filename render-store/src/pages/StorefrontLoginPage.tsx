import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { login, loading } = useStorefrontAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!storeFrontMeta?.storeId) return;
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    try {
      await login({ storeId: storeFrontMeta.storeId, email, password });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-[var(--ivory-white)]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--warm-beige)] max-h-[90vh] overflow-y-auto">
          {/* Header - matches original theme: serif heading, gold icon */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-[var(--gold)] to-[var(--light-gold)] shadow-[var(--shadow-gold)]">
              {storeFrontMeta?.name?.charAt(0) || 'S'}
            </div>
            <h1 className="text-xl font-bold text-[var(--charcoal-black)]" style={{ fontFamily: 'var(--font-serif)' }}>Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-12 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] outline-none transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-sm font-medium text-[var(--gold)] hover:text-[var(--dark-gold)] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="btn-login-primary w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[var(--charcoal-black)]/20 border-t-[var(--charcoal-black)] rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/auth/signup')}
                className="font-semibold text-[var(--gold)] hover:text-[var(--dark-gold)] transition-colors"
              >
                Create account
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <button type="button" className="underline hover:text-gray-600 transition-colors">Terms of Service</button>
            {' '}and{' '}
            <button type="button" className="underline hover:text-gray-600 transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorefrontLoginPage;
