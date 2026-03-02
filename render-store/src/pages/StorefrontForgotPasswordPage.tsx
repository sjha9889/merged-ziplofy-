import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';

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
    <SlantedImageCarouselWrapper>
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-2xl bg-white/95 p-8 shadow-2xl border border-gray-100 backdrop-blur-sm">
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
                className="text-sm font-medium text-[#d4af37] hover:text-[#b8941f] transition-colors"
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-lg">
                  <FiMail className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
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
                      className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] outline-none transition-all text-gray-900 placeholder-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-900/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                    className="font-semibold text-[#d4af37] hover:text-[#b8941f] transition-colors"
                  >
                    Create account
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </SlantedImageCarouselWrapper>
  );
};

export default StorefrontForgotPasswordPage;
