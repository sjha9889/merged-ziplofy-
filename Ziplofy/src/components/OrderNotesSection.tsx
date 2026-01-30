import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import AddNoteModal from './AddNoteModal';

interface OrderNotesSectionProps {
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

const OrderNotesSection: React.FC<OrderNotesSectionProps> = ({
  notes = '',
  onNotesChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveNote = useCallback(
    (note: string) => {
      if (onNotesChange) {
        onNotesChange(note);
      }
    },
    [onNotesChange]
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Notes</h3>
              <p className="text-sm text-gray-500">
                {notes.trim() || 'No notes'}
              </p>
            </div>
            <button
              onClick={handleEditClick}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Edit notes"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        initialNote={notes}
      />
    </>
  );
};

export default OrderNotesSection;

