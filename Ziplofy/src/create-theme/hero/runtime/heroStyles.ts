import { cfgBool, cfgNumber, cfgString } from '../../runtime/shared/config';

export type HeroScheme = {
  background: string;
  color: string;
  muted: string;
};

const COLOR_SCHEMES: Record<string, HeroScheme> = {
  'scheme-1': { background: '#ffffff', color: '#111827', muted: '#6b7280' },
  'scheme-2': { background: '#f8fafc', color: '#0f172a', muted: '#64748b' },
  'scheme-3': { background: '#fff7ed', color: '#431407', muted: '#9a3412' },
  'scheme-4': { background: '#f5f3ff', color: '#4c1d95', muted: '#6d28d9' },
  'scheme-5': { background: '#ecfdf5', color: '#064e3b', muted: '#047857' },
  'scheme-6': { background: '#1f2937', color: '#f9fafb', muted: '#9ca3af' },
};

const HEIGHT_PX: Record<string, number> = {
  small: 400,
  medium: 520,
  large: 680,
  full: 900,
};

export type HeroStyle = {
  scheme: HeroScheme;
  minHeight: number;
  paddingTop: number;
  paddingBottom: number;
  gap: number;
  media1Url: string;
  mediaOverlay: boolean;
  overlayColor: string;
  overlayStyle: 'solid' | 'gradient';
  overlayGradientDirection: 'up' | 'down';
  sectionLink: string;
  sectionLinkNewTab: boolean;
  customCss: string;
};

export function readHeroStyle(
  config: Record<string, unknown> | null,
  settingsBase: string,
  fallback: HeroScheme
): HeroStyle {
  const schemeKey = cfgString(config, `${settingsBase}.colorScheme`, 'scheme-6');
  const scheme = COLOR_SCHEMES[schemeKey] ?? fallback;

  const heightKey = cfgString(config, `${settingsBase}.height`, '');
  const legacyMin = cfgNumber(config, `${settingsBase}.minHeight`, 0);
  const minHeight =
    HEIGHT_PX[heightKey] ?? (legacyMin > 0 ? legacyMin : HEIGHT_PX.medium);

  return {
    scheme,
    minHeight,
    paddingTop: cfgNumber(config, `${settingsBase}.paddingTop`, 56),
    paddingBottom: cfgNumber(config, `${settingsBase}.paddingBottom`, 56),
    gap: cfgNumber(config, `${settingsBase}.layoutGap`, 16),
    media1Url: cfgString(config, `${settingsBase}.media1ImageUrl`, ''),
    mediaOverlay: cfgBool(config, `${settingsBase}.mediaOverlay`, true),
    overlayColor: cfgString(config, `${settingsBase}.overlayColor`, '#12121266'),
    overlayStyle:
      cfgString(config, `${settingsBase}.overlayStyle`, 'solid') === 'gradient' ? 'gradient' : 'solid',
    overlayGradientDirection:
      cfgString(config, `${settingsBase}.overlayGradientDirection`, 'up') === 'down' ? 'down' : 'up',
    sectionLink: cfgString(config, `${settingsBase}.sectionLink`, ''),
    sectionLinkNewTab: cfgBool(config, `${settingsBase}.sectionLinkNewTab`, false),
    customCss: cfgString(config, `${settingsBase}.customCss`, ''),
  };
}

export function scopedHeroCss(sectionId: string, css: string): string {
  const trimmed = css.trim();
  if (!trimmed) return '';
  return trimmed
    .split('\n')
    .map((line) => `[data-ziplofy-section="${sectionId}"] ${line}`)
    .join('\n');
}
