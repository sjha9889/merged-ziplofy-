
interface GeneralSettingsFooterProps {
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}

export default function GeneralSettingsFooter({
  onSave,
  saving,
  disabled,
}: GeneralSettingsFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-xs text-gray-600">
        To change your user level time zone and language visit your{' '}
        <a href="#" className="text-gray-700 hover:underline">
          account settings
        </a>
        .
      </p>
      <button
        onClick={onSave}
        disabled={disabled}
        className="cursor-pointer px-3 py-1.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

