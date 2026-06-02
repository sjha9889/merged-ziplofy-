import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStorefrontAuth, useStorefrontCart } from '@render-store/sdk';
import { useThemeConfig } from '@render-store/sdk';
import { cfgBool, cfgMenuItems, cfgNumber, cfgString } from '../lib/config';
import {
  alignFromPosition,
  headerBorderPx,
  headerColorScheme,
  headerHeightPadding,
  headerSearchEnabled,
  headerSectionWidth,
  headerStickyMode,
  scopedHeaderCss,
} from '../lib/headerStyles';
import { layoutBlockOrder } from '../lib/structureOrder';
import { EditorBlock, EditorField, EditorSection } from '../lib/editorAttrs';
import { layout, useThemeColors } from '../tokens';

type Props = { sectionId?: string };

export function Header({ sectionId = 'header' }: Props) {
  const config = useThemeConfig();
  const { pathname } = useLocation();
  const themeColors = useThemeColors();
  const { fontHeading, fontBody, primary, background: themeBg } = themeColors;
  const { user, logout } = useStorefrontAuth();
  const { getAllItems } = useStorefrontCart();
  const cartCount = getAllItems().reduce((s, i) => s + i.quantity, 0);

  const base = `sections.${sectionId}`;
  const settingsBase = `${base}.settings`;
  const logoBase = `${base}.blocks.logo.settings`;
  const menuBase = `${base}.blocks.menu.settings`;

  const headerState = useMemo(() => {
    const scheme = headerColorScheme(config, settingsBase, {
      background: themeBg,
      color: themeColors.text,
      border: layout.line,
    });
    return {
      scheme,
      widthMode: headerSectionWidth(config, settingsBase),
      height: headerHeightPadding(config, settingsBase),
      borderPx: headerBorderPx(config, settingsBase),
      stickyMode: headerStickyMode(config, settingsBase),
      customCss: cfgString(config, `${settingsBase}.customCss`, ''),
      logoText: cfgString(config, `${logoBase}.text`),
      tagline: cfgString(config, `${logoBase}.tagline`, ''),
      logoUrl: cfgString(config, `${settingsBase}.defaultLogoUrl`, '').trim(),
      logoPosition: cfgString(config, `${logoBase}.position`, 'left'),
      hideLogoOnHomePage: cfgBool(config, `${logoBase}.hideLogoOnHomePage`, false),
      logoPaddingTop: Math.max(0, cfgNumber(config, `${logoBase}.paddingTop`, 0)),
      logoPaddingBottom: Math.max(0, cfgNumber(config, `${logoBase}.paddingBottom`, 0)),
      menuPosition: cfgString(config, `${menuBase}.position`, 'left'),
      menuRow: cfgString(config, `${menuBase}.row`, 'top'),
      menuItems: cfgMenuItems(config, `${menuBase}.items`),
      menuStyle: cfgString(config, `${settingsBase}.menuStyle`, 'icons'),
      searchOn: headerSearchEnabled(config, settingsBase),
      searchPosition: cfgString(config, `${settingsBase}.searchPosition`, 'right'),
      searchRow: cfgString(config, `${settingsBase}.searchRow`, 'top'),
      searchPlaceholder: cfgString(config, `${settingsBase}.searchPlaceholder`),
      cartLabel: cfgString(config, `${settingsBase}.cartLabel`),
      showAccount: cfgString(config, `${settingsBase}.customerAccountMenu`, 'customer-account') !== 'none',
      showCountry: cfgBool(config, `${settingsBase}.countryRegionEnabled`, false),
      showFlag: cfgBool(config, `${settingsBase}.showFlag`, false),
      showLanguage: cfgBool(config, `${settingsBase}.languageSelectorEnabled`, false),
      locFont: cfgString(config, `${settingsBase}.localizationFont`, 'heading'),
      locSize: cfgString(config, `${settingsBase}.localizationSize`, '14px'),
      countryRegionLabel: cfgString(config, `${settingsBase}.countryRegionLabel`),
      languageLabel: cfgString(config, `${settingsBase}.languageLabel`),
    };
  }, [config, sectionId, settingsBase, logoBase, menuBase, themeBg, themeColors.text]);

  const {
    scheme,
    widthMode,
    height: { paddingY, minHeight },
    borderPx,
    stickyMode,
    customCss,
    logoText,
    tagline,
    logoUrl,
    logoPosition,
    hideLogoOnHomePage,
    logoPaddingTop,
    logoPaddingBottom,
    menuPosition,
    menuRow,
    menuItems,
    menuStyle,
    searchOn,
    searchPosition,
    searchRow,
    searchPlaceholder,
    cartLabel,
    showAccount,
    showCountry,
    showFlag,
    showLanguage,
    locFont,
    locSize,
    countryRegionLabel,
    languageLabel,
  } = headerState;
  const { text, background, border } = scheme;
  const scopedCss = scopedHeaderCss(sectionId, customCss);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (stickyMode !== 'on-scroll-up') return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [stickyMode]);

  const stickyActive =
    stickyMode === 'always' || (stickyMode === 'on-scroll-up' && scrolled);

  const isHomePage = pathname === '/' || pathname === '';
  const hideLogoOnHome =
    hideLogoOnHomePage && isHomePage && !stickyActive;

  const utilityStyle: CSSProperties = {
    fontSize: locSize,
    fontFamily: locFont === 'heading' ? fontHeading : fontBody,
    opacity: 0.85,
  };

  const blockNodes: Record<string, ReactNode> = {
    logo: hideLogoOnHome ? null : (
      <EditorBlock nodeId={`layout:${sectionId}:block:logo`} label="Logo">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: alignFromPosition(logoPosition),
            gap: 2,
            flex: logoPosition === 'center' ? 1 : undefined,
            paddingTop: logoPaddingTop,
            paddingBottom: logoPaddingBottom,
          }}
        >
          {logoUrl ? (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img src={logoUrl} alt={logoText} style={{ maxHeight: 40, display: 'block' }} />
            </Link>
          ) : (
            <Link to="/" style={{ textDecoration: 'none', color: text }}>
              <EditorField
                fieldPath={`${logoBase}.text`}
                label="Store name"
                as="span"
                style={{ fontFamily: fontHeading, fontSize: 26, fontWeight: 600, display: 'inline-block' }}
              >
                {logoText}
              </EditorField>
            </Link>
          )}
          {tagline && !logoUrl ? (
            <EditorField
              fieldPath={`${logoBase}.tagline`}
              label="Tagline"
              as="span"
              style={{ display: 'block', fontSize: 11, opacity: 0.65, lineHeight: 1.3 }}
            >
              {tagline}
            </EditorField>
          ) : null}
        </div>
      </EditorBlock>
    ),
    menu: (
      <EditorBlock
        nodeId={`layout:${sectionId}:block:menu`}
        label="Menu"
        style={{
          display: 'flex',
          flexDirection: menuRow === 'bottom' ? 'column-reverse' : 'column',
          alignItems: alignFromPosition(menuPosition),
          gap: 8,
          flex: menuPosition === 'center' ? 1 : undefined,
        }}
      >
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: alignFromPosition(menuPosition) }}>
          {menuItems.map((item, index) => {
            const nestedIds = ['link_shop', 'link_collections', 'link_about', 'link_account'] as const;
            const nestedId = nestedIds[index] ?? `link_${index}`;
            const labelPath = `${menuBase}.items.${index}.label`;
            const hrefPath = `${menuBase}.items.${index}.href`;
            return (
              <EditorBlock
                key={hrefPath}
                nodeId={`layout:${sectionId}:block:menu:nested:${nestedId}`}
                label={item.label}
              >
                <EditorField fieldPath={labelPath} label="Label">
                  <Link to={item.href} style={{ color: text, textDecoration: 'none', fontSize: 14 }}>
                    {item.label}
                  </Link>
                </EditorField>
              </EditorBlock>
            );
          })}
        </nav>
      </EditorBlock>
    ),
  };

  const innerMaxWidth = widthMode === 'full' ? '100%' : layout.maxWidth;

  const searchChip =
    searchOn ? (
      <span style={{ ...utilityStyle, fontSize: 16 }} title={searchPlaceholder} aria-hidden>
        ⌕
      </span>
    ) : null;

  const mainRow: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
    width: '100%',
  };

  const logoWrap: CSSProperties = {
    display: 'flex',
    flex: logoPosition === 'center' ? '1 1 100%' : '0 0 auto',
    justifyContent:
      logoPosition === 'center' ? 'center' : logoPosition === 'right' ? 'flex-end' : 'flex-start',
    order: logoPosition === 'right' ? 2 : 0,
    width: logoPosition === 'center' ? '100%' : undefined,
  };

  const menuWrap: CSSProperties = {
    display: 'flex',
    flex: 1,
    justifyContent: alignFromPosition(menuPosition),
    order: 1,
    minWidth: 0,
  };

  const utilWrap: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginLeft: 'auto',
    order: 3,
  };

  const topUtilities = (
    <div style={utilWrap}>
      {searchRow === 'top' && searchPosition === 'left' ? searchChip : null}
      {showCountry && countryRegionLabel ? (
        <span style={utilityStyle}>{showFlag ? '🇮🇳 ' : ''}{countryRegionLabel}</span>
      ) : null}
      {showLanguage && languageLabel ? (
        <span style={utilityStyle}>{languageLabel}</span>
      ) : null}
      {searchRow === 'top' && searchPosition === 'right' ? searchChip : null}
      {searchRow !== 'top' && searchPosition === 'left' ? searchChip : null}
      <Link
        to="/cart"
        style={{
          fontSize: 13,
          padding: '8px 12px',
          borderRadius: 8,
          border: `1px solid ${border}`,
          textDecoration: 'none',
          color: text,
        }}
      >
        {menuStyle === 'text' ? `${cartLabel} (${cartCount})` : `🛒 ${cartCount}`}
      </Link>
      {showAccount ? (
        user ? (
          <button
            type="button"
            onClick={() => void logout()}
            style={{
              fontSize: 13,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: primary,
              color: themeBg,
              cursor: 'pointer',
            }}
          >
            {menuStyle === 'text' ? 'Sign out' : '⎋'}
          </button>
        ) : (
          <Link to="/auth/login" style={{ color: primary, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            {menuStyle === 'text' ? 'Sign in' : '👤'}
          </Link>
        )
      ) : null}
      {searchRow !== 'top' && searchPosition === 'right' ? searchChip : null}
    </div>
  );

  return (
    <>
      {scopedCss ? <style>{scopedCss}</style> : null}
      <EditorSection
        sectionId={sectionId}
        label="Header"
        style={{
          position: stickyActive ? 'sticky' : 'relative',
          top: stickyActive ? 0 : undefined,
          zIndex: 50,
          background,
          borderBottom: borderPx > 0 ? `${borderPx}px solid ${border}` : undefined,
          fontFamily: fontBody,
          color: text,
          minHeight,
        }}
      >
        <div
          style={{
            maxWidth: innerMaxWidth,
            margin: '0 auto',
            padding: `${paddingY}px ${layout.padX}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {menuRow === 'top' ? (
            <div style={{ ...mainRow, justifyContent: alignFromPosition(menuPosition) }}>
              {blockNodes.menu}
            </div>
          ) : null}
          <div style={mainRow}>
            <div style={logoWrap}>{blockNodes.logo}</div>
            {menuRow !== 'top' && menuRow !== 'bottom' ? (
              <div style={menuWrap}>{blockNodes.menu}</div>
            ) : null}
            {topUtilities}
          </div>
          {menuRow === 'bottom' ? (
            <div style={{ ...mainRow, justifyContent: alignFromPosition(menuPosition) }}>
              {blockNodes.menu}
            </div>
          ) : null}
        </div>
      </EditorSection>
    </>
  );
}
