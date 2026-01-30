import React, { useCallback } from 'react';
import Modal from '../Modal';

interface CreateSegmentModalProps {
  isOpen: boolean;
  name: string;
  storeId: string;
  onNameChange: (name: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

const CreateSegmentModal: React.FC<CreateSegmentModalProps> = ({
  isOpen,
  name,
  storeId,
  onNameChange,
  onClose,
  onCreate,
}) => {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
    },
    [onNameChange]
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Create customer segment"
      maxWidth="sm"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!name.trim() || !storeId}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create customer segment
          </button>
        </>
      }
    >
      <div>
        <label htmlFor="create-segment-name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Name
        </label>
        <input
          id="create-segment-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full px-3 py-1.5 text-base border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          placeholder="Enter segment name"
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default CreateSegmentModal;

