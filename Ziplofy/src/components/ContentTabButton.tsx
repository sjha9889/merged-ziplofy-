
interface ContentTabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function ContentTabButton({ label, active, onClick }: ContentTabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`py-2 text-sm font-medium border-b transition-colors ${
        active ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

