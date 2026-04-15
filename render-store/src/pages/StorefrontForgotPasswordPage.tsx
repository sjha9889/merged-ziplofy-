import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';

const StorefrontForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !storeFrontMeta?.storeId) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    
    try {
      await forgotPassword({ 
        email: email.trim(),
        storeId: storeFrontMeta.storeId
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-[var(--ivory-white)]">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--warm-beige)]">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to login
          </button>

          {success ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-gray-500 mb-6">
                We've sent a password reset link to<br />
                <span className="font-medium text-gray-700">{email}</span>
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                type="button"
                onClick={() => { setSuccess(false); setEmail(''); }}
                className="text-sm font-medium text-[var(--gold)] hover:text-[var(--dark-gold)] transition-colors"
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-[var(--gold)] to-[var(--light-gold)] shadow-[var(--shadow-gold)]">
                  <FiMail className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--charcoal-black)]" style={{ fontFamily: 'var(--font-serif)' }}>Forgot password?</h1>
                <p className="mt-2 text-sm text-gray-500">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="Enter your email"
                      disabled={loading}
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-[var(--warm-beige)] rounded-xl bg-white focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] outline-none transition-all text-[var(--charcoal-black)] placeholder-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-login-primary w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[var(--charcoal-black)]/20 border-t-[var(--charcoal-black)] rounded-full animate-spin" />
                  ) : (
                    <>
                      Send reset link
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorefrontForgotPasswordPage;
