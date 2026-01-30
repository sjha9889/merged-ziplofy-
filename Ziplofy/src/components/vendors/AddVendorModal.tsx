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
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
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
          className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-300 outline-none transition-colors bg-white text-sm"
          placeholder="Enter vendor name"
        />
      </div>
    </Modal>
  );
};

export default AddVendorModal;

