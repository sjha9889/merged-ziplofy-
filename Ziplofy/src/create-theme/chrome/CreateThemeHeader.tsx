import React from 'react';
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { CreateThemePagePicker } from './CreateThemePagePicker';
import type { EditorSchemaDoc } from '../sidebar/create-theme-sidebar.types';
import type { ThemePreviewPage } from './CreateThemeLivePreview';

type Props = {
  themeName: string;
  onThemeNameChange: (name: string) => void;
  packLabel?: string;
  previewPage: ThemePreviewPage;
  onPreviewPageChange: (page: ThemePreviewPage) => void;
  manifest: Record<string, unknown> | null;
  editorSchema: EditorSchemaDoc | null;
  device: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
  onViewJson?: () => void;
  viewJsonDisabled?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
  saving?: boolean;
};

export function CreateThemeHeader({
  themeName,
  onThemeNameChange,
  packLabel = 'Horizon',
  previewPage,
  onPreviewPageChange,
  manifest,
  editorSchema,
  device,
  onDeviceChange,
  onViewJson,
  viewJsonDisabled,
  onSave,
  saveDisabled = false,
  saving = false,
}: Props) {
  return (
    <header className="relative grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-gray-200 bg-white px-3">
      <div className="flex min-w-0 items-center gap-2 justify-self-start">
        <input
          type="text"
          value={themeName}
          onChange={(e) => onThemeNameChange(e.target.value)}
          className="max-w-[180px] truncate rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-gray-900 hover:border-gray-200 focus:border-[#005bd3] focus:outline-none"
          aria-label="Theme name"
        />
        <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-800">
          Draft
        </span>
        <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">{packLabel}</span>
      </div>

      <div className="justify-self-center">
        <CreateThemePagePicker
          value={previewPage}
          onChange={onPreviewPageChange}
          manifest={manifest}
          editorSchema={editorSchema}
        />
      </div>

      <div className="flex items-center gap-2 justify-self-end">
        {onViewJson ? (
          <button
            type="button"
            onClick={onViewJson}
            disabled={viewJsonDisabled}
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:inline-flex"
            title="View live theme JSON"
          >
            <span className="font-mono text-[11px] text-gray-500">{'{}'}</span>
            View theme JSON
          </button>
        ) : null}
        <div className="flex rounded-lg border border-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            className={`flex h-8 w-9 items-center justify-center rounded-md ${
              device === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Desktop preview"
          >
            <ComputerDesktopIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            className={`flex h-8 w-9 items-center justify-center rounded-md ${
              device === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Mobile preview"
          >
            <DevicePhoneMobileIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled || saving}
          className="ml-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}
