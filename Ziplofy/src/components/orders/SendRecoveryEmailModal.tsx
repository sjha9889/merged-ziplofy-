import React, { useCallback } from 'react';
import Modal from '../Modal';

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

interface SendRecoveryEmailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  emailSubject: string;
  emailBody: string;
  emailTemplate: string;
  onClose: () => void;
  onTemplateChange: (template: string) => void;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  onSubmit: () => void;
}

const SendRecoveryEmailModal: React.FC<SendRecoveryEmailModalProps> = ({
  isOpen,
  customer,
  emailSubject,
  emailBody,
  emailTemplate,
  onClose,
  onTemplateChange,
  onSubjectChange,
  onBodyChange,
  onSubmit,
}) => {
  const handleTemplateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onTemplateChange(e.target.value);
    },
    [onTemplateChange]
  );

  const handleSubjectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSubjectChange(e.target.value);
    },
    [onSubjectChange]
  );

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onBodyChange(e.target.value);
    },
    [onBodyChange]
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-base font-medium text-gray-900">Send Recovery Email</h2>
          {customer && (
            <p className="text-xs text-gray-500 mt-1">
              To: {customer.firstName} {customer.lastName} ({customer.email})
            </p>
          )}
        </div>
      }
      maxWidth="lg"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!emailSubject.trim() || !emailBody.trim()}
            className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
          >
            Send Email
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Template Selection */}
        <div>
          <label htmlFor="email-template" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Template
          </label>
          <select
            id="email-template"
            value={emailTemplate}
            onChange={handleTemplateChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            <option value="custom">Custom Message</option>
            <option value="reminder">Friendly Reminder</option>
            <option value="discount">Special Offer</option>
          </select>
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Subject
          </label>
          <input
            id="email-subject"
            type="text"
            value={emailSubject}
            onChange={handleSubjectChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            required
          />
        </div>

        {/* Body Field */}
        <div>
          <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Body
          </label>
          <textarea
            id="email-body"
            value={emailBody}
            onChange={handleBodyChange}
            rows={8}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none font-mono"
            placeholder="Enter your email message here..."
            required
          />
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 p-3 border border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Preview:</h4>
          <p className="text-xs font-medium text-gray-900 mb-1.5">Subject: {emailSubject}</p>
          <p className="text-xs text-gray-600 whitespace-pre-line">{emailBody}</p>
        </div>
      </div>
    </Modal>
  );
};

export default SendRecoveryEmailModal;

