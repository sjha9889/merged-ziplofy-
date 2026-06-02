import { cfgBool, cfgString } from '../../runtime/shared/config';

export type HeroButtonStyle = {
  padding: string;
  borderRadius: number;
  fontSize: number;
  fontWeight: number;
  background: string;
  color: string;
  border: string;
  openInNewTab: boolean;
};

export function readHeroButtonStyle(
  config: Record<string, unknown> | null,
  settingsBase: string,
  fallbackVariant: 'primary' | 'secondary',
  colors: { primary: string; background: string; text: string; line: string },
  options?: { onImageHero?: boolean; marqueeFilled?: boolean }
): HeroButtonStyle {
  const variantKey = cfgString(config, `${settingsBase}.buttonStyle`, fallbackVariant);
  const variant = variantKey === 'primary' ? 'primary' : 'secondary';
  const isPrimary = variant === 'primary';
  const onImage = Boolean(options?.onImageHero);
  const marqueeFilled = Boolean(options?.marqueeFilled);

  if (marqueeFilled && isPrimary) {
    return {
      padding: '10px 24px',
      borderRadius: 9999,
      fontSize: 14,
      fontWeight: 500,
      background: '#ffffff',
      color: '#111827',
      border: 'none',
      openInNewTab: cfgBool(config, `${settingsBase}.openInNewTab`, false),
    };
  }

  if (onImage && isPrimary) {
    return {
      padding: '11px 26px',
      borderRadius: 6,
      fontSize: 15,
      fontWeight: 500,
      background: 'transparent',
      color: '#ffffff',
      border: '1px solid rgba(255,255,255,0.9)',
      openInNewTab: cfgBool(config, `${settingsBase}.openInNewTab`, false),
    };
  }

  return {
    padding: isPrimary ? '14px 28px' : '14px 24px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    background: isPrimary ? colors.primary : 'transparent',
    color: isPrimary ? colors.background : colors.text,
    border: isPrimary ? 'none' : `1px solid ${colors.line}`,
    openInNewTab: cfgBool(config, `${settingsBase}.openInNewTab`, false),
  };
}
