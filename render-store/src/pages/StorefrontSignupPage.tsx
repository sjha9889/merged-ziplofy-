import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { signup, loading } = useStorefrontAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = async () => {
    if (!storeFrontMeta?.storeId) return;
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    setError('');
    try {
      await signup({ storeId: storeFrontMeta.storeId, firstName, lastName, email, password });
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-[var(--ivory-white)]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--warm-beige)] max-h-[90vh] overflow-y-auto">
          {/* Header - matches original: serif heading, gold icon */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-[var(--gold)] to-[var(--light-gold)] shadow-[var(--shadow-gold)]">
              {storeFrontMeta?.name?.charAt(0) || 'S'}
            </div>
            <h1 className="text-xl font-bold text-[var(--charcoal-black)]" style={{ fontFamily: 'var(--font-serif)' }}>Create your account</h1>
            <p className="mt-2 text-sm text-gray-500">
              Join us and start your shopping journey
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="John"
                    className="block w-full pl-9 pr-3 py-2.5 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Doe"
                  className="block w-full px-3 py-2.5 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  placeholder="john@example.com"
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  placeholder="Create a strong password"
                  className="block w-full pl-10 pr-12 py-2.5 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 focus:ring-[var(--gold)]/30"
                style={{ accentColor: 'var(--gold)' }}
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the{' '}
                <button type="button" className="text-[var(--gold)] hover:text-[var(--dark-gold)] hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-[var(--gold)] hover:text-[var(--dark-gold)] hover:underline">Privacy Policy</button>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSignup}
              className="btn-login-primary w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[var(--charcoal-black)]/20 border-t-[var(--charcoal-black)] rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/auth/login')}
                className="font-semibold text-[var(--gold)] hover:text-[var(--dark-gold)] transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorefrontSignupPage;
