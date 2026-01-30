import React, { useCallback } from 'react';
import Modal from '../Modal';

interface EditSegmentModalProps {
  isOpen: boolean;
  editName: string;
  onNameChange: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditSegmentModal: React.FC<EditSegmentModalProps> = ({
  isOpen,
  editName,
  onNameChange,
  onClose,
  onSave,
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
      title="Edit customer segment"
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
            onClick={onSave}
            disabled={!editName.trim()}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </>
      }
    >
      <div>
        <label htmlFor="edit-segment-name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Name
        </label>
        <input
          id="edit-segment-name"
          type="text"
          value={editName}
          onChange={handleNameChange}
          className="w-full px-3 py-1.5 text-base border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          placeholder="Enter segment name"
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default EditSegmentModal;

