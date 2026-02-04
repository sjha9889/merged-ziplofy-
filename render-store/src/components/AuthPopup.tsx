import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/auth/signup');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-24 w-[92%] max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-center text-lg font-semibold text-gray-900">
          Want to add items to cart?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please login or register with us to add items to your cart and continue shopping.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="min-w-[120px] rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleSignup}
            className="min-w-[120px] rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
