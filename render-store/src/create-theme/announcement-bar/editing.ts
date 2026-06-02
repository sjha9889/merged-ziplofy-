import type { CreateThemeEditing } from '../types';

export const editing: CreateThemeEditing = {
  sectionLabel: 'Announcement bar',
  sectionSettingsOrder: [
    { key: 'enabled', label: 'Show announcement', type: 'boolean' },
    { key: 'timeToNext', label: 'Time to next announcement', type: 'number' },
    { key: 'sectionWidth', label: 'Section width' },
    { key: 'colorScheme', label: 'Color scheme' },
    { key: 'paddingTop', label: 'Padding top', type: 'number' },
    { key: 'paddingBottom', label: 'Padding bottom', type: 'number' },
  ],
  blocks: [
    {
      blockId: 'announcement',
      label: 'Announcement',
      settingsOrder: [{ key: 'text', label: 'Text' }],
    },
  ],
};
