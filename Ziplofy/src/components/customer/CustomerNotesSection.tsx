import React, { useCallback } from 'react';

interface CustomerNotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
}

const CustomerNotesSection: React.FC<CustomerNotesSectionProps> = ({
  notes,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="bg-white p-4 rounded border border-gray-200">
      <h2 className="text-base font-medium text-gray-900 mb-4">Notes</h2>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Add any additional notes about this customer..."
        rows={4}
        className="w-full px-3 py-2 text-base text-gray-900 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
      />
    </div>
  );
};

export default CustomerNotesSection;

