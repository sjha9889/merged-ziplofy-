import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useThemeConfig } from '@render-store/sdk';
import { cfgNumber, cfgString } from '../../runtime/shared/config';
import { EditorBlock, EditorField, EditorSection } from '../../runtime/shared/editorAttrs';
import { layoutBlockOrder, templateBlockOrder } from '../../runtime/shared/structureOrder';
import { layout, useThemeColors } from '../../runtime/shared/tokens';
import { HERO_MARQUEE_TEXT, LARGE_LOGO_BODY } from '../../../utils/hero-banner-variants.util';
import {
  HERO_BOTTOM_ALIGNED_BODY,
  HERO_BOTTOM_ALIGNED_DEFAULT_IMAGE,
  heroBottomAlignedPaths,
} from '../../../utils/hero-bottom-aligned.util';
import { readHeroButtonStyle } from './heroButtonStyles';
import { readHeroStyle, scopedHeroCss } from './heroStyles';
import { HeroLandscapeBackdrop } from './HeroLandscapeBackdrop';

type Props = {
  sectionId: string;
  placement?: 'layout' | 'template';
  templateId?: string;
};

function heroSettingsBase(sectionId: string, placement: 'layout' | 'template', templateId: string): string {
  return placement === 'layout'
    ? `sections.${sectionId}.settings`
    : `templates.${templateId}.sections.${sectionId}.settings`;
}

function heroBlocksBase(sectionId: string, placement: 'layout' | 'template', templateId: string): string {
  return placement === 'layout'
    ? `sections.${sectionId}.blocks`
    : `templates.${templateId}.sections.${sectionId}.blocks`;
}

function heroSectionNodeId(
  sectionId: string,
  placement: 'layout' | 'template',
  templateId: string
): string {
  return placement === 'layout' ? `layout:${sectionId}` : `template:${templateId}:${sectionId}`;
}

function heroBlockNodeId(
  sectionId: string,
  placement: 'layout' | 'template',
  templateId: string,
  blockId: string
): string {
  return `${heroSectionNodeId(sectionId, placement, templateId)}:block:${blockId}`;
}

function HeroButton({
  blockId,
  fallbackVariant,
  blocksBase,
  sectionNodePrefix,
  colors,
  onImageHero,
  marqueeFilled,
}: {
  blockId: string;
  fallbackVariant: 'primary' | 'secondary';
  blocksBase: string;
  sectionNodePrefix: string;
  colors: { primary: string; background: string; text: string; line: string };
  onImageHero?: boolean;
  marqueeFilled?: boolean;
}) {
  const config = useThemeConfig();
  const base = `${blocksBase}.${blockId}.settings`;
  const label = cfgString(config, `${base}.label`, '');
  const href = cfgString(config, `${base}.href`, '/');
  const btnStyle = useMemo(
    () =>
      readHeroButtonStyle(config, base, fallbackVariant, colors, { onImageHero, marqueeFilled }),
    [config, base, fallbackVariant, colors, onImageHero, marqueeFilled]
  );

  if (!label.trim()) return null;

  return (
    <EditorBlock nodeId={`${sectionNodePrefix}:block:${blockId}`} label="Button">
      <Link
        to={href}
        target={btnStyle.openInNewTab ? '_blank' : undefined}
        rel={btnStyle.openInNewTab ? 'noopener noreferrer' : undefined}
        style={{
          display: 'inline-block',
          padding: btnStyle.padding,
          borderRadius: btnStyle.borderRadius,
          background: btnStyle.background,
          color: btnStyle.color,
          border: btnStyle.border,
          textDecoration: 'none',
          fontWeight: btnStyle.fontWeight,
          fontSize: btnStyle.fontSize,
          boxSizing: 'border-box',
          lineHeight: 1.2,
        }}
      >
        <EditorField fieldPath={`${base}.label`} label="Label">
          {label}
        </EditorField>
      </Link>
    </EditorBlock>
  );
}

export function Hero({
  sectionId,
  placement = 'template',
  templateId = 'index',
}: Props) {
  const config = useThemeConfig();
  const { primary, background, text, fontHeading, fontBody } = useThemeColors();

  const settingsBase = heroSettingsBase(sectionId, placement, templateId);
  const blocksBase = heroBlocksBase(sectionId, placement, templateId);
  const sectionNodePrefix = heroSectionNodeId(sectionId, placement, templateId);

  const catalogVariant = cfgString(config, `${settingsBase}.catalogVariant`, '');
  const isBottomAligned = catalogVariant === 'hero-bottom-aligned';
  const isMarquee = catalogVariant === 'hero-marquee';
  const isLargeLogo = catalogVariant === 'large-logo';
  const isClassicHero = !isBottomAligned && !isMarquee && !isLargeLogo;

  const title = cfgString(
    config,
    `${settingsBase}.title`,
    'Browse our latest products'
  );
  const subtitle = cfgString(config, `${settingsBase}.subtitle`, '');
  const eyebrow = cfgString(config, `${settingsBase}.eyebrow`, '');

  const hero = useMemo(
    () =>
      readHeroStyle(config, settingsBase, {
        background,
        color: text,
        muted: '#9ca3af',
      }),
    [config, settingsBase, background, text]
  );

  const buttonColors = useMemo(
    () => ({
      primary,
      background,
      text: '#ffffff',
      line: layout.line,
    }),
    [primary, background]
  );

  const defaultBlockOrder = isMarquee
    ? ['primary_button']
    : isBottomAligned
      ? []
      : ['heading', 'primary_button', 'secondary_button'];

  const blockOrder =
    placement === 'layout'
      ? layoutBlockOrder(config, sectionId, defaultBlockOrder)
      : templateBlockOrder(config, templateId, sectionId, defaultBlockOrder);

  const overlayBackground =
    hero.overlayStyle === 'gradient'
      ? hero.overlayGradientDirection === 'down'
        ? `linear-gradient(180deg, transparent 0%, ${hero.overlayColor} 100%)`
        : `linear-gradient(180deg, ${hero.overlayColor} 0%, transparent 100%)`
      : hero.overlayColor;

  const bgUrl = hero.media1Url.trim();
  const scopedCss = scopedHeroCss(sectionId, hero.customCss);

  if (isBottomAligned) {
    const bottomPaths = heroBottomAlignedPaths(blocksBase);
    const bottomIntro = cfgString(
      config,
      bottomPaths.textIntro,
      cfgString(config, `${settingsBase}.eyebrow`, 'Introducing')
    );
    const bottomTitle = cfgString(
      config,
      bottomPaths.headingMain,
      cfgString(config, `${settingsBase}.title`, 'New arrivals')
    );
    const bottomBodyText = cfgString(
      config,
      bottomPaths.textBody,
      cfgString(config, `${settingsBase}.subtitle`, HERO_BOTTOM_ALIGNED_BODY)
    );

    const bottomBlockNode = (blockId: 'text_intro' | 'heading_main' | 'text_body') =>
      blockId === 'text_body'
        ? `${sectionNodePrefix}:block:content_group:nested:text_body`
        : `${sectionNodePrefix}:block:content_group:nested:heading_group:nested:${blockId}`;

    const sectionMinHeight = hero.minHeight;
    const sidePad = 40;
    const bottomPad = Math.max(hero.paddingBottom, 48);
    const bottomBgUrl = bgUrl || HERO_BOTTOM_ALIGNED_DEFAULT_IMAGE;
    const topPad = hero.paddingTop > 0 ? hero.paddingTop : 0;
    const bottomOverlay = hero.mediaOverlay ? overlayBackground : undefined;
    const textColor = '#ffffff';

    const bottomRow = (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: Math.max(hero.gap, 32),
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ flex: '1 1 50%', minWidth: 0, textAlign: 'left' }}>
          {bottomIntro.trim() ? (
            <EditorBlock nodeId={bottomBlockNode('text_intro')} label="Text">
              <EditorField
                fieldPath={bottomPaths.textIntro}
                label="Text"
                as="p"
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  lineHeight: 1.4,
                  color: textColor,
                }}
              >
                {bottomIntro}
              </EditorField>
            </EditorBlock>
          ) : null}
          {bottomTitle.trim() ? (
            <EditorBlock nodeId={bottomBlockNode('heading_main')} label="Heading">
              <EditorField
                fieldPath={bottomPaths.headingMain}
                label="Text"
                as="h1"
                style={{
                  margin: bottomIntro.trim() ? '8px 0 0' : 0,
                  fontFamily: fontHeading,
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: textColor,
                }}
              >
                {bottomTitle}
              </EditorField>
            </EditorBlock>
          ) : null}
        </div>
        {bottomBodyText.trim() ? (
          <div
            style={{
              flex: '0 1 42%',
              maxWidth: 440,
              textAlign: 'right',
              alignSelf: 'flex-end',
            }}
          >
            <EditorBlock nodeId={bottomBlockNode('text_body')} label="Text">
              <EditorField
                fieldPath={bottomPaths.textBody}
                label="Text"
                as="p"
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: textColor,
                }}
              >
                {bottomBodyText}
              </EditorField>
            </EditorBlock>
          </div>
        ) : null}
      </div>
    );

    const bottomStack = (
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: sectionMinHeight,
          width: '100%',
          padding: `${topPad}px ${sidePad}px ${bottomPad}px`,
          boxSizing: 'border-box',
        }}
      >
        {bottomRow}
      </div>
    );

    const bottomLinkedStack = hero.sectionLink ? (
      <Link
        to={hero.sectionLink}
        target={hero.sectionLinkNewTab ? '_blank' : undefined}
        rel={hero.sectionLinkNewTab ? 'noopener noreferrer' : undefined}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
      >
        {bottomStack}
      </Link>
    ) : (
      bottomStack
    );

    return (
      <>
        {scopedCss ? <style>{scopedCss}</style> : null}
        <EditorSection
          sectionId={sectionId}
          editorNodeId={sectionNodePrefix}
          label="Hero: Bottom aligned"
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            minHeight: sectionMinHeight,
            padding: 0,
            background: '#2d6478',
            fontFamily: fontBody,
            color: textColor,
            boxSizing: 'border-box',
          }}
        >
          {bottomBgUrl ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: `center/cover url(${bottomBgUrl}) no-repeat`,
              }}
            />
          ) : (
            <HeroLandscapeBackdrop />
          )}
          {bottomOverlay ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: bottomOverlay,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          ) : null}
          {bottomLinkedStack}
        </EditorSection>
      </>
    );
  }

  if (isMarquee) {
    const marqueeText = cfgString(
      config,
      `${settingsBase}.marqueeText`,
      cfgString(config, `${settingsBase}.subtitle`, HERO_MARQUEE_TEXT)
    );
    const sectionMinHeight = hero.minHeight;
    const bottomPad = Math.max(hero.paddingBottom, 48);
    const marqueeBgUrl = bgUrl || HERO_BOTTOM_ALIGNED_DEFAULT_IMAGE;
    const marqueeOverlay = hero.mediaOverlay ? overlayBackground : undefined;
    const marqueeAnimId = `ziplofy-hero-marquee-${sectionId.replace(/[^a-z0-9_-]/gi, '-')}`;

    const primaryButton = (
      <HeroButton
        blockId="primary_button"
        fallbackVariant="primary"
        blocksBase={blocksBase}
        sectionNodePrefix={sectionNodePrefix}
        colors={buttonColors}
        marqueeFilled
      />
    );

    const marqueeBody = (
      <div
        style={{
          position: 'relative',
          minHeight: sectionMinHeight,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              whiteSpace: 'nowrap',
              fontFamily: fontHeading,
              fontSize: 'clamp(2.25rem, 6vw, 4.25rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 2px 24px rgba(0,0,0,0.25)',
              animation: `${marqueeAnimId} 22s linear infinite`,
            }}
          >
            <EditorField
              fieldPath={`${settingsBase}.marqueeText`}
              label="Marquee"
              as="span"
              style={{ padding: '0 0.35em', display: 'inline' }}
            >
              {marqueeText}&nbsp;
            </EditorField>
            <span style={{ padding: '0 0.35em' }} aria-hidden>
              {marqueeText}&nbsp;
            </span>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: bottomPad,
            zIndex: 4,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          {primaryButton ? <span style={{ display: 'inline-flex' }}>{primaryButton}</span> : null}
        </div>
        <style>{`
          @keyframes ${marqueeAnimId} {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    );

    const marqueeLinkedBody = hero.sectionLink ? (
      <Link
        to={hero.sectionLink}
        target={hero.sectionLinkNewTab ? '_blank' : undefined}
        rel={hero.sectionLinkNewTab ? 'noopener noreferrer' : undefined}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
      >
        {marqueeBody}
      </Link>
    ) : (
      marqueeBody
    );

    return (
      <>
        {scopedCss ? <style>{scopedCss}</style> : null}
        <EditorSection
          sectionId={sectionId}
          editorNodeId={sectionNodePrefix}
          label="Hero: Marquee"
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            minHeight: sectionMinHeight,
            padding: 0,
            background: '#2d6478',
            fontFamily: fontBody,
            color: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          {marqueeBgUrl ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: `center/cover url(${marqueeBgUrl}) no-repeat`,
              }}
            />
          ) : (
            <HeroLandscapeBackdrop />
          )}
          {marqueeOverlay ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: marqueeOverlay,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          ) : null}
          {marqueeLinkedBody}
        </EditorSection>
      </>
    );
  }

  if (isLargeLogo) {
    const cornerText =
      cfgString(config, `${blocksBase}.text_2.settings.text`, '') ||
      cfgString(config, `${settingsBase}.subtitle`, LARGE_LOGO_BODY);
    const logoTitle = cfgString(config, `${settingsBase}.title`, 'My Store').trim() || 'My Store';
    const padTop = Math.max(hero.paddingTop, 40);
    const padBottom = Math.max(hero.paddingBottom, 48);
    const padX = 40;
    const sectionMinHeight = hero.minHeight;
    const backgroundMedia = cfgString(config, `${settingsBase}.backgroundMedia`, 'none');
    const backgroundImageUrl = cfgString(config, `${settingsBase}.backgroundImageUrl`, '');
    const hasBgImage = backgroundMedia === 'image' && Boolean(backgroundImageUrl.trim());
    const borderStyle = cfgString(config, `${settingsBase}.borderStyle`, 'none');
    const cornerRadius = cfgNumber(config, `${settingsBase}.cornerRadius`, 0);
    const defaultLogoUrl = cfgString(config, `${settingsBase}.defaultLogoUrl`, '');
    const sectionBorder =
      borderStyle === 'solid' ? `1px solid ${hero.scheme.muted}55` : undefined;
    const sectionBg = hasBgImage ? hero.scheme.background : hero.scheme.background || '#f0f1ed';
    const largeLogoOverlay =
      hero.mediaOverlay && hasBgImage
        ? hero.overlayStyle === 'gradient'
          ? hero.overlayGradientDirection === 'down'
            ? `linear-gradient(180deg, transparent 0%, ${hero.overlayColor} 100%)`
            : `linear-gradient(180deg, ${hero.overlayColor} 0%, transparent 100%)`
          : hero.overlayColor
        : undefined;

    const largeLogoInner = (
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          minHeight: sectionMinHeight,
          padding: `${padTop}px ${padX}px ${padBottom}px`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: cornerRadius > 0 ? cornerRadius : undefined,
          border: sectionBorder,
          overflow: cornerRadius > 0 ? 'hidden' : undefined,
        }}
      >
        {cornerText.trim() ? (
          <EditorBlock
            nodeId={heroBlockNodeId(sectionId, placement, templateId, 'text_2')}
            label="Text"
          >
            <EditorField
              fieldPath={`${blocksBase}.text_2.settings.text`}
              label="Text"
              as="p"
              style={{
                margin: 0,
                maxWidth: 300,
                fontSize: 15,
                lineHeight: 1.5,
                color: '#111827',
                alignSelf: 'flex-start',
              }}
            >
              {cornerText}
            </EditorField>
          </EditorBlock>
        ) : null}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 32,
            paddingBottom: 24,
            minHeight: 280,
            width: '100%',
          }}
        >
          {defaultLogoUrl.trim() ? (
            <EditorField fieldPath={`${settingsBase}.defaultLogoUrl`} label="Default logo" as="div">
              <img
                src={defaultLogoUrl}
                alt={logoTitle}
                style={{
                  display: 'block',
                  maxWidth: 'min(92%, 1200px)',
                  maxHeight: 'min(42vh, 520px)',
                  width: 'auto',
                  height: 'auto',
                  margin: '0 auto',
                  objectFit: 'contain',
                }}
              />
            </EditorField>
          ) : (
            <EditorField
              fieldPath={`${settingsBase}.title`}
              label="Text"
              as="h1"
              style={{
                margin: 0,
                fontFamily: fontHeading,
                fontSize: 'clamp(4rem, 18vw, 11rem)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#000000',
                textAlign: 'center',
                width: '100%',
              }}
            >
              {logoTitle}
            </EditorField>
          )}
        </div>
      </div>
    );

    const largeLogoLinked = hero.sectionLink ? (
      <Link
        to={hero.sectionLink}
        target={hero.sectionLinkNewTab ? '_blank' : undefined}
        rel={hero.sectionLinkNewTab ? 'noopener noreferrer' : undefined}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
      >
        {largeLogoInner}
      </Link>
    ) : (
      largeLogoInner
    );

    return (
      <>
        {scopedCss ? <style>{scopedCss}</style> : null}
        <EditorSection
          sectionId={sectionId}
          editorNodeId={sectionNodePrefix}
          label="Large logo"
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            minHeight: sectionMinHeight,
            padding: 0,
            background: sectionBg,
            fontFamily: fontBody,
            color: '#111827',
            boxSizing: 'border-box',
          }}
        >
          {hasBgImage ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: `center/cover url(${backgroundImageUrl}) no-repeat`,
              }}
            />
          ) : null}
          {largeLogoOverlay ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: largeLogoOverlay,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          ) : null}
          {largeLogoLinked}
        </EditorSection>
      </>
    );
  }

  const renderHeading = (classic: boolean) => {
    const headingFieldPath = `${blocksBase}.heading.settings.heading`;
    const headingText =
      cfgString(config, headingFieldPath, '') || title;
    if (!headingText.trim()) return null;

    return (
      <EditorBlock
        nodeId={heroBlockNodeId(sectionId, placement, templateId, 'heading')}
        label="Heading"
      >
        <EditorField
          fieldPath={headingFieldPath}
          label="Text"
          as="h1"
          style={{
            margin: 0,
            width: '100%',
            maxWidth: 720,
            fontFamily: fontHeading,
            fontSize: classic ? 'clamp(2.25rem, 5vw, 3.25rem)' : 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          {headingText}
        </EditorField>
      </EditorBlock>
    );
  };

  const renderBodyText = () => {
    const body =
      cfgString(config, `${blocksBase}.text_2.settings.text`, '') || subtitle;
    if (!body.trim()) return null;
    return (
      <EditorBlock
        nodeId={heroBlockNodeId(sectionId, placement, templateId, 'text_2')}
        label="Text"
      >
        <EditorField
          fieldPath={`${blocksBase}.text_2.settings.text`}
          label="Text"
          as="p"
          style={{
            margin: 0,
            fontSize: 'clamp(0.95rem, 2vw, 1.125rem)',
            lineHeight: 1.55,
            maxWidth: 620,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
          }}
        >
          {body}
        </EditorField>
      </EditorBlock>
    );
  };

  const renderBlock = (blockId: string, classic: boolean): ReactNode => {
    if (blockId === 'heading' || blockId.startsWith('heading_')) {
      return renderHeading(classic);
    }
    if (blockId === 'text_2' || (blockId.startsWith('text_') && blockId !== 'heading')) {
      return renderBodyText();
    }
    if (blockId === 'primary_button' || blockId === 'secondary_button') {
      const variant: 'primary' | 'secondary' =
        blockId === 'secondary_button' ? 'secondary' : 'primary';
      return (
        <HeroButton
          key={blockId}
          blockId={blockId}
          fallbackVariant={variant}
          blocksBase={blocksBase}
          sectionNodePrefix={sectionNodePrefix}
          colors={buttonColors}
          onImageHero={classic || isMarquee}
        />
      );
    }
    if (blockId.endsWith('_button')) {
      return (
        <HeroButton
          key={blockId}
          blockId={blockId}
          fallbackVariant="primary"
          blocksBase={blocksBase}
          sectionNodePrefix={sectionNodePrefix}
          colors={buttonColors}
          onImageHero={classic}
        />
      );
    }
    return null;
  };

  const classicContent = (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: hero.minHeight,
        width: '100%',
        padding: `${hero.paddingTop}px 24px ${hero.paddingBottom}px`,
        boxSizing: 'border-box',
        gap: Math.min(hero.gap, 20),
      }}
    >
      {eyebrow.trim() ? (
        <EditorField
          fieldPath={`${settingsBase}.eyebrow`}
          label="Eyebrow"
          as="p"
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {eyebrow}
        </EditorField>
      ) : null}
      {blockOrder.length > 0
        ? blockOrder.map((blockId) => (
            <span key={blockId} style={{ display: 'contents' }}>
              {renderBlock(blockId, true)}
            </span>
          ))
        : (
          <>
            {renderHeading(true)}
            {renderBodyText()}
          </>
        )}
      {!blockOrder.includes('heading') && title.trim() ? (
        <EditorField
          fieldPath={`${settingsBase}.title`}
          label="Text"
          as="h1"
          style={{
            margin: 0,
            maxWidth: 720,
            fontFamily: fontHeading,
            fontSize: 'clamp(2.25rem, 5vw, 3.25rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          {title}
        </EditorField>
      ) : null}
    </div>
  );

  const stack = classicContent;

  const body = hero.sectionLink ? (
    <Link
      to={hero.sectionLink}
      target={hero.sectionLinkNewTab ? '_blank' : undefined}
      rel={hero.sectionLinkNewTab ? 'noopener noreferrer' : undefined}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
    >
      {stack}
    </Link>
  ) : (
    stack
  );

  const sectionLabel = 'Hero';

  const classicOverlay =
    hero.mediaOverlay && (bgUrl || isClassicHero)
      ? overlayBackground
      : undefined;

  return (
    <>
      {scopedCss ? <style>{scopedCss}</style> : null}
      <EditorSection
        sectionId={sectionId}
        editorNodeId={sectionNodePrefix}
        label={sectionLabel}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          minHeight: hero.minHeight,
          padding: 0,
          background: '#1a3a4a',
          fontFamily: fontBody,
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {bgUrl ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: `center/cover url(${bgUrl}) no-repeat`,
            }}
          />
        ) : (
          <HeroLandscapeBackdrop />
        )}
        {classicOverlay ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: classicOverlay,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ) : null}
        {body}
      </EditorSection>
    </>
  );
}
