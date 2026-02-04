import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';

const StorefrontResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resetToken = searchParams.get('reset-token');
    if (!resetToken) {
      // Redirect to login if no token
      navigate('/auth/login');
      return;
    }
    setToken(resetToken);
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword.trim()) {
      setPasswordError('Password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!token) {
      setPasswordError('Invalid reset token');
      return;
    }

    if (!storeFrontMeta?.storeId) {
      setPasswordError('Store information not available');
      return;
    }
    
    setPasswordError('');
    
    try {
      await resetPassword({ 
        token, 
        newPassword: newPassword.trim(),
        storeId: storeFrontMeta.storeId
      });

    } catch (error) {
      // Error is handled in the context
    }
  };

  // Show loading if no token yet
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 text-center shadow ring-1 ring-black/5">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
          <p className="mt-3 text-sm text-gray-600">Validating reset token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
        <h1 className="text-xl font-extrabold text-gray-900">Reset Password</h1>
        <p className="mt-1 text-sm text-gray-600">Enter your new password below.</p>

        {passwordError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-gray-900">New Password</span>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span className="text-xs text-gray-500">Password must be at least 6 characters long</span>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-gray-900">Confirm New Password</span>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default StorefrontResetPasswordPage;
