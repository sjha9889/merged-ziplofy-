import type { SectionRuntimeComponent } from './types';
import { AnnouncementBar } from '../announcement-bar/runtime/AnnouncementBar';
import { Divider } from '../divider/runtime/Divider';
import { Header } from '../header/runtime/Header';
/** Live UI components keyed by schema `section.type`. */
export const SECTION_RUNTIME_BY_TYPE: Record<string, SectionRuntimeComponent> = {
  header: Header,
  'announcement-bar': AnnouncementBar,
  divider: Divider,
};

export function resolveRuntimeForSectionType(sectionType: string): SectionRuntimeComponent | null {
  return SECTION_RUNTIME_BY_TYPE[sectionType] ?? null;
}

export function blueprintIdFromInstanceId(instanceId: string): string {
  const known = [
    'announcement_bar',
    'header',
    'footer',
    'footer_utilities',
    'divider',
    'hero_main',
    'featured_collection',
  ];
  for (const base of known) {
    if (instanceId === base || instanceId.startsWith(`${base}_`)) return base;
  }
  const idx = instanceId.indexOf('_');
  return idx > 0 ? instanceId.slice(0, idx) : instanceId;
}
