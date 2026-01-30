import React from 'react';

interface AttributionMenuProps {
  isOpen: boolean;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const AttributionMenu: React.FC<AttributionMenuProps> = ({
  isOpen,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 shadow-lg z-20">
        <div className="px-3 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            Attribution model
          </p>
        </div>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${
              selectedValue === option
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
        <div className="px-3 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            A 30-day attribution window applies.{' '}
            <button className="text-gray-700 hover:text-gray-900 underline">
              Learn more
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AttributionMenu;

