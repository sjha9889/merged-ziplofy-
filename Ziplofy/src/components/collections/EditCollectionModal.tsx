import React from 'react';
import Modal from '../Modal';

interface EditCollectionForm {
  title: string;
  description: string;
  pageTitle: string;
  metaDescription: string;
  urlHandle: string;
  status: 'draft' | 'published';
}

interface EditCollectionModalProps {
  isOpen: boolean;
  formData: EditCollectionForm;
  onChange: (field: keyof EditCollectionForm, value: string | 'draft' | 'published') => void;
  onClose: () => void;
  onUpdate: () => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  formData,
  onChange,
  onClose,
  onUpdate,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Edit collection"
      maxWidth="md"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            Update
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title
          </label>
          <input
            id="edit-title"
            type="text"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit-page-title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Page title
          </label>
          <input
            id="edit-page-title"
            type="text"
            value={formData.pageTitle}
            onChange={(e) => onChange('pageTitle', e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="edit-meta-description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Meta description
          </label>
          <textarea
            id="edit-meta-description"
            value={formData.metaDescription}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors resize-none"
          />
        </div>
        <div>
          <label htmlFor="edit-url-handle" className="block text-sm font-medium text-gray-700 mb-1.5">
            URL handle
          </label>
          <input
            id="edit-url-handle"
            type="text"
            value={formData.urlHandle}
            onChange={(e) => onChange('urlHandle', e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="edit-status"
            value={formData.status}
            onChange={(e) => onChange('status', e.target.value as 'draft' | 'published')}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors bg-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default EditCollectionModal;
