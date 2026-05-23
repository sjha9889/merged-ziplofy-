import React, { memo, useMemo, useState } from 'react';
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
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
  const changeType = fieldTypeFromSchema(field.type);

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-1">
      <span className="text-[13px] text-gray-800">{field.label}</span>
      <div className="inline-flex rounded-lg border border-[#c9cccf] bg-[#f1f1f1] p-0.5">
        {(field.options ?? []).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onFieldChange(field.path, changeType, opt.value)}
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

function RichTextFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const id = fieldInputId(field.path);
  const value = fieldValueAsString(values, field);

  return (
    <div className="space-y-1.5 py-1">
      <label htmlFor={id} className="block text-[13px] font-medium text-gray-800">
        {field.label}
      </label>
      <div className="overflow-hidden rounded-lg border border-[#c9cccf] bg-white shadow-sm focus-within:border-[#005bd3] focus-within:ring-1 focus-within:ring-[#005bd3]">
        <div className="flex items-center gap-0.5 border-b border-[#e1e1e1] bg-[#f6f6f7] px-2 py-1">
          <button type="button" className="rounded px-2 py-0.5 text-[12px] font-bold text-gray-700 hover:bg-[#ededed]" title="Bold">
            B
          </button>
          <button type="button" className="rounded px-2 py-0.5 text-[12px] italic text-gray-700 hover:bg-[#ededed]" title="Italic">
            I
          </button>
          <button type="button" className="rounded p-1 text-gray-600 hover:bg-[#ededed]" title="Link">
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onFieldChange(field.path, 'textarea', e.target.value)}
          className="w-full resize-y border-0 px-3 py-2 text-[13px] text-gray-900 focus:outline-none"
        />
      </div>
    </div>
  );
}

function LinkFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const id = fieldInputId(field.path);

  return (
    <div className="space-y-1.5 py-1">
      <label htmlFor={id} className="block text-[13px] font-medium text-gray-800">
        {field.label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={fieldValueAsString(values, field)}
          onChange={(e) => onFieldChange(field.path, 'text', e.target.value)}
          placeholder={field.placeholder ?? 'Paste a link or search'}
          className="w-full rounded-lg border border-[#c9cccf] bg-white py-2 pl-3 pr-9 text-[13px] text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        />
        <LinkIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function InfoLinkFieldRow({
  label,
  href = '/settings/general',
  description,
}: {
  label: string;
  href?: string;
  description?: string;
}) {
  return (
    <div className="py-1">
      <button
        type="button"
        className="text-[13px] text-gray-800 underline decoration-gray-400 underline-offset-2 hover:text-gray-900"
        onClick={() => {
          window.open(href, '_blank', 'noopener,noreferrer');
        }}
      >
        {label}
      </button>
      {description ? <p className="mt-1 text-[12px] text-gray-500">{description}</p> : null}
    </div>
  );
}

function SelectFieldRow({
  field,
  values,
  onFieldChange,
}: {
  field: EditorFieldDef;
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const current = fieldValueAsString(values, field) || field.options?.[0]?.value || '';

  return (
    <div className="space-y-1">
      <label className="block text-[12px] text-gray-600">{field.label}</label>
      <div className="relative">
        <select
          value={current}
          onChange={(e) => onFieldChange(field.path, 'text', e.target.value)}
          className="w-full appearance-none rounded-lg border border-[#c9cccf] bg-white py-2 pl-3 pr-8 text-[13px] text-gray-900 shadow-sm focus:border-[#005bd3] focus:outline-none focus:ring-1 focus:ring-[#005bd3]"
        >
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      {field.description ? (
        <p className="text-[12px] text-gray-500">
          {field.description.includes('theme settings') ? (
            <>
              Edit presets in{' '}
              <button
                type="button"
                className="text-[#005bd3] underline underline-offset-2 hover:text-[#004299]"
                onClick={() => window.open('/settings/theme', '_blank', 'noopener,noreferrer')}
              >
                theme settings
              </button>
            </>
          ) : (
            field.description
          )}
        </p>
      ) : null}
    </div>
  );
}

function CollapsibleSettingsGroup({
  label,
  fields,
  values,
  onFieldChange,
}: {
  label: string;
  fields: EditorFieldDef[];
  values: Record<string, string | boolean>;
  onFieldChange: (path: string, type: ThemeEditorFieldType, value: string | boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[#e1e1e1] px-1 py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-2 text-left text-[13px] font-medium text-gray-800"
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="space-y-1 pb-2">
          {fields.map((field) => (
            <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
          ))}
        </div>
      ) : null}
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
      <div className="py-1">
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-transparent hover:border-gray-100"
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
        {field.description ? (
          <p className="mt-1 text-[12px] text-gray-500">{field.description}</p>
        ) : null}
      </div>
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
    case 'richtext':
      return <RichTextFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    case 'link':
      return <LinkFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    case 'info-link':
      return (
        <InfoLinkFieldRow
          label={field.label}
          href={field.placeholder || '/settings/general'}
          description={field.description}
        />
      );
    case 'select':
      return <SelectFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
    default:
      if (field.type === 'select' && field.options?.length) {
        return <SelectFieldRow field={field} values={values} onFieldChange={onFieldChange} />;
      }
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
    const order = [
      'Collection',
      'Media 1',
      'Media 2',
      'Mobile media',
      'Section link',
      'Text',
      'Content',
      'Logo',
      'Menu',
      'Customer account',
      'Search',
      'Localization',
      'Content',
      'Typography',
      'General',
      'Heading',
      'Input',
      'Submit button',
      'Borders',
      'Appearance',
      'Size',
      'Section layout',
      'Layout',
      'Size',
      'Utilities',
      'Colors',
      'Page backgrounds',
      'Theme settings',
      'Padding',
      'Custom CSS',
    ];
    const sorted: Array<{ label: string; fields: EditorFieldDef[] }> = [];
    for (const label of order) {
      const list = map.get(label);
      if (list?.length) sorted.push({ label, fields: list });
      map.delete(label);
    }
    for (const [label, list] of map) sorted.push({ label, fields: list });
    if (ungrouped.length) {
      const infoOnly = ungrouped.filter((f) => f.widget === 'info-link');
      const rest = ungrouped.filter((f) => f.widget !== 'info-link');
      if (infoOnly.length) sorted.unshift({ label: '__info__', fields: infoOnly });
      if (rest.length) sorted.unshift({ label: 'Settings', fields: rest });
    }
    return sorted;
  }, [fields]);

  const flatOnly = groups.length === 1 && groups[0]?.label === 'Settings';

  if (flatOnly) {
    return (
      <div className="px-1 py-2">
        <div className="space-y-1">
          {groups[0].fields.map((field) => (
            <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#e1e1e1]">
      {groups.map((group) =>
        group.label === '__info__' ? (
          <div key={group.label} className="px-1 pb-2 pt-1">
            {group.fields.map((field) => (
              <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
            ))}
          </div>
        ) : group.label === 'Custom CSS' ? (
          <div key={group.label} className="px-1 py-1">
            {group.fields.map((field) => (
              <SettingsFieldRow key={field.path} field={field} values={values} onFieldChange={onFieldChange} />
            ))}
          </div>
        ) : group.label === 'Theme settings' ? (
          <CollapsibleSettingsGroup
            key={group.label}
            label="Theme settings"
            fields={group.fields}
            values={values}
            onFieldChange={onFieldChange}
          />
        ) : group.label === 'Typography' ? (
          <div key={group.label} className="px-1 py-3">
            <h3 className="mb-2 text-[13px] font-semibold text-gray-900">{group.label}</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {group.fields
                .filter((f) => f.widget !== 'segmented')
                .map((field) => (
                  <SelectFieldRow
                    key={field.path}
                    field={field}
                    values={values}
                    onFieldChange={onFieldChange}
                  />
                ))}
            </div>
            {group.fields
              .filter((f) => f.widget === 'segmented')
              .map((field) => (
                <div key={field.path} className="mt-3">
                  <span className="mb-1.5 block text-[12px] text-gray-600">{field.label}</span>
                  <div className="inline-flex w-full max-w-md rounded-lg border border-[#c9cccf] bg-[#f1f1f1] p-0.5">
                    {(field.options ?? []).map((opt) => {
                      const current =
                        fieldValueAsString(values, field) || field.options?.[0]?.value || 'default';
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onFieldChange(field.path, 'text', opt.value)}
                          className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                            current === opt.value
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
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
  onRemoveBlock?: () => void;
};

const ThemeSectionSettingsPanelInner: React.FC<ThemeSectionSettingsPanelProps> = ({
  node,
  values,
  onFieldChange,
  onClose,
  onRemoveSection,
  onRemoveBlock,
}) => {
  const fields = node.fields ?? [];
  const canRemoveSection = node.kind === 'section' && Boolean(onRemoveSection);
  const canRemoveBlock = node.kind === 'block' && Boolean(onRemoveBlock);
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

      {canRemoveSection || canRemoveBlock ? (
        <div className="shrink-0 border-t border-[#e1e1e1] bg-white p-3">
          <button
            type="button"
            onClick={canRemoveBlock ? onRemoveBlock : onRemoveSection}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-2 text-[13px] font-medium text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            {canRemoveBlock ? 'Remove block' : 'Remove section'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export const ThemeSectionSettingsPanel = memo(ThemeSectionSettingsPanelInner);
export default ThemeSectionSettingsPanel;
