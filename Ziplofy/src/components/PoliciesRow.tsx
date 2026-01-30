import React from 'react';

interface PoliciesRowProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

const PoliciesRow: React.FC<PoliciesRowProps> = ({ icon, label, right, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
  >
    <div className="w-8 h-8 flex items-center justify-center text-gray-600 shrink-0">{icon}</div>
    <span className="flex-1 text-sm text-gray-900">{label}</span>
    {right}
  </button>
);

export default PoliciesRow;

