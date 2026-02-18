
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
    <div className="sticky bottom-0 z-20 -mx-4 px-4 py-3 bg-white/90 backdrop-blur border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-gray-500">
          To change your user-level time zone and language, visit your{' '}
          <a href="#" className="text-gray-700 hover:underline">
            account settings
          </a>
          .
        </p>
        <button
          onClick={onSave}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

