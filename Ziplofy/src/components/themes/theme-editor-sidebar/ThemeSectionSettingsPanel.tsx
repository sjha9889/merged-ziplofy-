import React, { memo, useMemo, useState } from 'react';
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { EditorFieldDef, SidebarNode } from './theme-editor-sidebar.types';
import {
  fieldInputId,
  fieldTypeFromSchema,
  fieldValueAsString,
  type ThemeEditorFieldType,
} from './theme-editor-field.utils';

function SectionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  );
}

const SCHEME_SWATCHES: Record<string, { bg: string; fg: string; accent: string }> = {
  'scheme-1': { bg: '#111827', fg: '#f9fafb', accent: '#60a5fa' },
  'scheme-2': { bg: '#1e3a5f', fg: '#eff6ff', accent: '#93c5fd' },
  'scheme-3': { bg: '#431407', fg: '#fff7ed', accent: '#fb923c' },
  'scheme-4': { bg: '#4c1d95', fg: '#f5f3ff', accent: '#c4b5fd' },
};

function numValue(values: Record<string, string | boolean>, field: EditorFieldDef, fallback: number): number {
  const raw = values[field.path];
  const n = Number(raw);
  if (Number.isFinite(n)) return n;
  if (field.min != null && Number.isFinite(field.min)) return field.min;
  return fallback;
}

function SliderFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const min = field.min ?? 0;
  const max = field.max ?? 100;
  const step = field.step ?? 1;
  const current = numValue(values, field, min);
  const id = fieldInputId(field.path);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1">
      <label htmlFor={id} className="text-[13px] text-gray-800">
        {field.label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onFieldChange(field.path, 'number', e.target.value)}
          className="h-1.5 w-[120px] cursor-pointer accent-gray-900"
        />
        <div className="flex items-center rounded-lg border border-[#c9cccf] bg-white shadow-sm">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onFieldChange(field.path, 'number', e.target.value)}
            className="w-10 border-0 bg-transparent px-2 py-1.5 text-center text-[13px] text-gray-900 focus:outline-none"
            aria-label={field.label}
          />
          {field.unit ? (
            <span className="border-l border-[#e1e1e1] px-2 text-[12px] text-gray-500">{field.unit}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SegmentedFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const current = fieldValueAsString(values, field) || field.options?.[0]?.value || 'page';

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1">
      <span className="text-[13px] text-gray-800">{field.label}</span>
      <div className="inline-flex rounded-lg border border-[#c9cccf] bg-[#f1f1f1] p-0.5">
        {(field.options ?? []).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onFieldChange(field.path, 'text', opt.value)}
            className={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors ${
              current === opt.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorSchemeFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const current = fieldValueAsString(values, field) || 'scheme-4';
  const swatch = SCHEME_SWATCHES[current] ?? SCHEME_SWATCHES['scheme-4'];

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1">
      <span className="text-[13px] text-gray-800">{field.label}</span>
      <div className="relative min-w-[140px]">
        <div
          className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-[#e1e1e1] bg-white px-1 py-0.5"
          aria-hidden
        >
          <span className="text-[10px] font-semibold" style={{ color: swatch.fg }}>
            Aa
          </span>
          <span className="h-3 w-3 rounded-sm" style={{ background: swatch.bg }} />
          <span className="h-3 w-3 rounded-sm" style={{ background: swatch.accent }} />
        </div>
        <select
          value={current}
          onChange={(e) => onFieldChange(field.path, 'text', e.target.value)}
          className="w-full appearance-none rounded-lg border border-[#c9cccf] bg-white py-2 pl-[72px] pr-8 text-[13px] text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}

function AccordionFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = fieldInputId(field.path);

  return (
    <div className="border-t border-[#e1e1e1] pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-2 text-left text-[13px] font-medium text-gray-800"
      >
        {field.label}
        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <textarea
          id={id}
          rows={4}
          value={fieldValueAsString(values, field)}
          onChange={(e) => onFieldChange(field.path, 'textarea', e.target.value)}
          placeholder="/* Custom CSS */"
          className="mb-2 w-full resize-y rounded-lg border border-[#c9cccf] bg-white px-3 py-2 font-mono text-xs text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        />
      ) : null}
    </div>
  );
}

function DefaultFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const type = fieldTypeFromSchema(field.type);
  const id = fieldInputId(field.path);
  const val = values[field.path];

  if (type === 'boolean') {
    return (
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-transparent py-1 hover:border-gray-100"
      >
        <span className="text-[13px] font-medium text-gray-800">{field.label}</span>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(val)}
          onChange={(e) => onFieldChange(field.path, type, e.target.checked)}
          className="h-[18px] w-[18px] shrink-0 rounded border-gray-300 text-[#005bd3] focus:ring-[#005bd3]"
        />
      </label>
    );
  }

  return (
    <div className="space-y-1.5 py-1">
      <label htmlFor={id} className="block text-[13px] font-medium text-gray-800">
        {field.label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          rows={3}
          value={fieldValueAsString(values, field)}
          onChange={(e) => onFieldChange(field.path, type, e.target.value)}
          className="w-full resize-y rounded-lg border border-[#c9cccf] bg-white px-3 py-2 text-[13px] text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        />
      ) : (
        <input
          id={id}
          type={type === 'number' ? 'number' : 'text'}
          value={fieldValueAsString(values, field)}
          onChange={(e) => onFieldChange(field.path, type, e.target.value)}
          className="w-full rounded-lg border border-[#c9cccf] bg-white px-3 py-2 text-[13px] text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        />
      )}
    </div>
  );
}

function SettingsFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  switch (field.widget) {
    case 'slider':
      return <SliderFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    case 'segmented':
      return <SegmentedFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    case 'color-scheme':
      return <ColorSchemeFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    case 'accordion':
      return <AccordionFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    default:
      return <DefaultFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
  }
}

function GroupedSettingsFields({
  fields,
  values,
  onFieldChange,
}: {
  fields: EditorFieldDef[];
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, EditorFieldDef[]>();
    const ungrouped: EditorFieldDef[] = [];
    for (const field of fields) {
      if (field.group) {
        const list = map.get(field.group) ?? [];
        list.push(field);
        map.set(field.group, list);
      } else {
        ungrouped.push(field);
      }
    }
    const order = ['General', 'Appearance', 'Padding', 'Custom CSS', 'Content'];
    const sorted: Array<{ label: string; fields: EditorFieldDef[] }> = [];
    for (const label of order) {
      const list = map.get(label);
      if (list?.length) sorted.push({ label, fields: list });
      map.delete(label);
    }
    for (const [label, list] of map) sorted.push({ label, fields: list });
    if (ungrouped.length) sorted.unshift({ label: 'Settings', fields: ungrouped });
    return sorted;
  }, [fields]);

  return (
    <div className="divide-y divide-[#e1e1e1]">
      {groups.map((group) =>
        group.label === 'Custom CSS' ? (
          <div key={group.label} className="px-1 py-1">
            {group.fields.map((field) => (
              <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
            ))}
          </div>
        ) : (
          <div key={group.label} className="px-1 py-3">
            <h3 className="mb-2 text-[13px] font-semibold text-gray-900">{group.label}</h3>
            <div className="space-y-1">
              {group.fields.map((field) => (
                <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

type ThemeSectionSettingsPanelProps = {
  node: SidebarNode;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
  onClose: () => void;
  onRemoveSection?: () => void;
};

const ThemeSectionSettingsPanelInner: React.FC<ThemeSectionSettingsPanelProps> = ({
  node,
  values,
  onFieldChange,
  onClose,
  onRemoveSection,
}) => {
  const fields = node.fields ?? [];
  const canRemove = node.kind === 'section' && Boolean(onRemoveSection);
  const useGrouped = fields.some((f) => Boolean(f.group));

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center gap-2 border-b border-[#e1e1e1] bg-[#f6f6f7] px-2 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#005bd3] px-2 py-1.5 text-white">
          <SectionIcon className="h-4 w-4 shrink-0 opacity-90" />
          <span className="truncate text-[13px] font-semibold">{node.label}</span>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-[#ededed]"
          title="More actions"
          aria-label="More actions"
        >
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-[#ededed]"
          title="Close settings"
          aria-label="Close settings"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
        {fields.length === 0 ? (
          <p className="text-[13px] text-gray-500">No settings for this item.</p>
        ) : useGrouped ? (
          <GroupedSettingsFields fields={fields} values={values} onFieldChange={onFieldChange} />
        ) : (
          <div className="space-y-4">
            {fields.map((field) => (
              <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
            ))}
          </div>
        )}
      </div>

      {canRemove ? (
        <div className="shrink-0 border-t border-[#e1e1e1] bg-white p-3">
          <button
            type="button"
            onClick={onRemoveSection}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-2 text-[13px] font-medium text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            Remove section
          </button>
        </div>
      ) : null}
    </div>
  );
};

export const ThemeSectionSettingsPanel = memo(ThemeSectionSettingsPanelInner);
export default ThemeSectionSettingsPanel;
