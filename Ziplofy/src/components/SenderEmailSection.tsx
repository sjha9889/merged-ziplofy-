import React from 'react';
import toast from 'react-hot-toast';

interface SenderEmailSectionProps {
  loading: boolean;
  storeNotificationEmail: {
    email: string;
    isVerified: boolean;
  } | null;
  onOpenAddEmailModal: () => void;
}

const SenderEmailSection: React.FC<SenderEmailSectionProps> = ({
  loading,
  storeNotificationEmail,
  onOpenAddEmailModal,
}) => {
  return (
    <div className="border border-gray-200 p-4 mb-4 bg-white/95">
      <h2 className="text-sm font-medium mb-1 text-gray-900">Sender email</h2>
      <p className="text-xs text-gray-600 mb-4">
        The email your store uses to send emails to your customers
      </p>

      {loading ? (
        <p className="text-xs text-gray-600 py-2">Loading...</p>
      ) : storeNotificationEmail ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="email"
              value={storeNotificationEmail.email}
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 bg-white text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <span
              className={`px-2 py-1 text-xs font-medium h-8 flex items-center ${
                storeNotificationEmail.isVerified
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {storeNotificationEmail.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">
              Confirm you have access to this email.{' '}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement resend verification
                  toast.success('Verification email sent');
                }}
                className="text-gray-700 hover:underline"
              >
                Resend verification
              </button>
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-end items-center mt-2">
          <button
            onClick={onOpenAddEmailModal}
            className="px-3 py-1.5 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Add email
          </button>
        </div>
      )}
    </div>
  );
};

export default SenderEmailSection;

