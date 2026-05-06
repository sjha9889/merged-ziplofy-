import React, { useState } from 'react';
import { FiArrowRight, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';
import {
  getSignupPasswordInlineIssue,
  SIGNUP_PASSWORD_MIN_LENGTH,
  validateSignupPasswordForSubmit,
} from '../utils/signup-password';

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
}

type AuthView = 'choice' | 'login' | 'signup';
type ExtendedAuthView = AuthView | 'forgot';

const AuthPopup: React.FC<AuthPopupProps> = ({ open, onClose, onAuthenticated }) => {
  const { storeFrontMeta } = useStorefront();
  const { login, signup, forgotPassword, loading } = useStorefrontAuth();

  const [view, setView] = useState<ExtendedAuthView>('choice');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const resetState = () => {
    setView('choice');
    setError('');
    setInfo('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupEmail('');
    setSignupPassword('');
    setForgotEmail('');
    setShowLoginPassword(false);
    setShowSignupPassword(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleLogin = async () => {
    if (!storeFrontMeta?.storeId) return;
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setInfo('');
    try {
      await login({
        storeId: storeFrontMeta.storeId,
        email: loginEmail.trim(),
        password: loginPassword,
      });
      handleClose();
      onAuthenticated?.();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async () => {
    if (!storeFrontMeta?.storeId) return;
    if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword) {
      setError('Please fill in all fields.');
      return;
    }
    const passwordErr = validateSignupPasswordForSubmit(signupPassword);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }
    setError('');
    setInfo('');
    try {
      await signup({
        storeId: storeFrontMeta.storeId,
        firstName: signupFirstName.trim(),
        lastName: signupLastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });
      handleClose();
      onAuthenticated?.();
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!storeFrontMeta?.storeId) return;
    if (!forgotEmail.trim()) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setInfo('');
    try {
      await forgotPassword({
        email: forgotEmail.trim(),
        storeId: storeFrontMeta.storeId,
      });
      setInfo('Reset link sent. Check your inbox.');
      setView('login');
      setLoginEmail(forgotEmail.trim());
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link.');
    }
  };

  if (!open) return null;

  const signupPasswordInlineIssue = getSignupPasswordInlineIssue(signupPassword);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      <div className="relative mx-auto mt-20 w-[94%] max-w-xl rounded-3xl border border-gray-200/90 bg-linear-to-b from-white via-white to-gray-50 p-7 shadow-[0_20px_60px_rgba(17,24,39,0.25)]">
        <button
          type="button"
          aria-label="Close popup"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <FiX className="h-5 w-5" />
        </button>

        {view === 'choice' ? (
          <>
            <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900">
              Want to add items to cart?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-gray-600">
              Please login or register with us to add items to your cart and continue shopping.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setInfo('');
                  setView('login');
                }}
                className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setInfo('');
                  setView('signup');
                }}
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <div className="pt-1">
            <h3 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
              {view === 'login'
                ? 'Sign in to continue'
                : view === 'signup'
                  ? 'Create your account'
                  : 'Forgot password'}
            </h3>
            <p className="mt-1 text-center text-xs text-gray-500">
              {view === 'login'
                ? 'Access your account without leaving checkout'
                : view === 'signup'
                  ? 'Create account to save cart and checkout faster'
                  : 'Reset your password and continue checkout'}
            </p>
            {info ? (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {info}
              </div>
            ) : null}
            {error ? (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {view === 'login' ? (
              <div className="mt-5 space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading ? <FiArrowRight className="h-4 w-4" /> : null}
                </button>
                <p className="pt-1 text-center text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setInfo('');
                      setForgotEmail(loginEmail);
                      setView('forgot');
                    }}
                    className="mr-2 font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    Forgot password?
                  </button>
                  <span className="text-gray-300">|</span>{' '}
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setInfo('');
                      setView('signup');
                    }}
                    className="font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    Create account
                  </button>
                </p>
              </div>
            ) : view === 'signup' ? (
              <div className="mt-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600">First name</label>
                    <input
                      type="text"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600">Last name</label>
                    <input
                      type="text"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Password"
                      aria-invalid={signupPasswordInlineIssue ? true : undefined}
                      className={`w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2 ${
                        signupPasswordInlineIssue
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200/50'
                          : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showSignupPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p
                    className={`mt-1 text-xs ${signupPasswordInlineIssue ? 'text-red-600' : 'text-gray-500'}`}
                  >
                    {signupPasswordInlineIssue ?? `At least ${SIGNUP_PASSWORD_MIN_LENGTH} characters`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                  {!loading ? <FiArrowRight className="h-4 w-4" /> : null}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setInfo('');
                      setView('login');
                    }}
                    className="font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3.5">
                <p className="text-center text-sm leading-relaxed text-gray-600">
                  Enter your account email and we will send you a reset link.
                </p>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Sending reset link...' : 'Send reset link'}
                  {!loading ? <FiArrowRight className="h-4 w-4" /> : null}
                </button>
                <p className="text-center text-xs text-gray-500">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setInfo('');
                      setView('login');
                    }}
                    className="font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    Back to login
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          {view !== 'choice' ? (
            <button
              type="button"
              onClick={() => {
                setError('');
                setInfo('');
                setView('choice');
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
