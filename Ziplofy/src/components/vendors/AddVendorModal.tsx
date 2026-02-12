import React from 'react';
import Modal from '../Modal';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onVendorNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  onVendorNameChange,
  onSubmit,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Add Vendor"
      maxWidth="sm"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </>
      }
    >
      <div>
        <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Enter vendor name
        </label>
        <input
          id="vendor-name"
          type="text"
          autoFocus
          value={vendorName}
          onChange={onVendorNameChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-colors bg-white text-sm"
          placeholder="Enter vendor name"
        />
      </div>
    </Modal>
  );
};

export default AddVendorModal;

