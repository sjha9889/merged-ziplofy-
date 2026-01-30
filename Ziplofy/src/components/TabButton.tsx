import React from 'react';

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  id,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? 'text-gray-900 border-b-2 border-gray-900'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;

