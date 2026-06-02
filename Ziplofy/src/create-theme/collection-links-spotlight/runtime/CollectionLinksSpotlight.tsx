import { useMemo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useThemeConfig } from '@render-store/sdk';
import { cfgString } from '../../runtime/shared/config';
import { EditorBlock, EditorField, EditorSection } from '../../runtime/shared/editorAttrs';
import { layout, useThemeColors } from '../../runtime/shared/tokens';
import type { SectionRuntimeProps } from '../../runtime/types';
import { CollectionLinksSpotlightArt } from './CollectionLinksSpotlightArt';
import {
  readCollectionLinks,
  readCollectionLinksSpotlightLayout,
  scopedCollectionLinksCss,
  textAlignForAlignment,
} from './collectionLinksStyles';

export function CollectionLinksSpotlight({
  sectionId,
  templateId = 'index',
  placement = 'template',
}: SectionRuntimeProps) {
  const config = useThemeConfig();
  const { fontBody } = useThemeColors();

  const settingsBase =
    placement === 'template'
      ? `templates.${templateId}.sections.${sectionId}.settings`
      : `sections.${sectionId}.settings`;

  const editorNodeId =
    placement === 'template' ? `template:${templateId}:${sectionId}` : `layout:${sectionId}`;

  const layoutStyle = useMemo(
    () => readCollectionLinksSpotlightLayout(config, settingsBase),
    [config, settingsBase]
  );

  const catalogVariant = cfgString(
    config,
    `${settingsBase}.catalogVariant`,
    'collection-links-spotlight'
  );
  const isTextLayout =
    layoutStyle.layoutMode === 'text' || catalogVariant === 'collection-links-text';
  const sectionLabel = isTextLayout ? 'Collection links: Text' : 'Collection links: Spotlight';

  const links = useMemo(
    () => readCollectionLinks(config, templateId, sectionId, placement),
    [config, templateId, sectionId, placement]
  );

  const customCss = scopedCollectionLinksCss(sectionId, layoutStyle.customCss);
  const textAlign = textAlignForAlignment(layoutStyle.alignment) as CSSProperties['textAlign'];

  const horizontalPad = layoutStyle.sectionWidth === 'full' ? 24 : layout.padX;

  const outerStyle: CSSProperties = {
    paddingTop: layoutStyle.paddingTop,
    paddingBottom: layoutStyle.paddingBottom,
    paddingLeft: horizontalPad,
    paddingRight: horizontalPad,
    background: layoutStyle.scheme.background,
    color: layoutStyle.scheme.color,
    fontFamily: fontBody,
    boxSizing: 'border-box',
    width: '100%',
  };

  const innerStyle: CSSProperties =
    layoutStyle.sectionWidth === 'full'
      ? { maxWidth: '100%', width: '100%' }
      : { maxWidth: layout.maxWidth, margin: '0 auto', width: '100%' };

  const linkItemStyle: CSSProperties = isTextLayout
    ? {
        margin: 0,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.25,
        color: layoutStyle.scheme.color,
        textDecoration: 'none',
        textAlign,
        display: 'inline-block',
      }
    : {
        margin: 0,
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.25,
        color: layoutStyle.scheme.color,
        textDecoration: 'none',
        textAlign,
      };

  const countStyle: CSSProperties = isTextLayout
    ? { marginLeft: 2, fontSize: 8, fontWeight: 400, color: layoutStyle.scheme.muted, verticalAlign: 'super' }
    : { marginLeft: 4, fontSize: '0.65em', fontWeight: 400, color: layoutStyle.scheme.muted };

  const linksList = (
    <div
      style={
        isTextLayout
          ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              columnGap: 24,
              rowGap: 20,
              maxWidth: 560,
              margin: '0 auto',
              justifyItems:
                layoutStyle.alignment === 'center'
                  ? 'center'
                  : layoutStyle.alignment === 'right'
                    ? 'end'
                    : 'start',
            }
          : {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 20,
              alignItems:
                layoutStyle.alignment === 'center'
                  ? 'center'
                  : layoutStyle.alignment === 'right'
                    ? 'flex-end'
                    : 'flex-start',
            }
      }
    >
      {links.map((link) => {
        const blockBase =
          placement === 'template'
            ? `templates.${templateId}.sections.${sectionId}.blocks.${link.id}.settings`
            : `sections.${sectionId}.blocks.${link.id}.settings`;
        const blockNodeId =
          placement === 'template'
            ? `template:${templateId}:${sectionId}:block:${link.id}`
            : `layout:${sectionId}:block:${link.id}`;

        const to = link.href.startsWith('/') ? link.href : `/${link.href}`;

        return (
          <EditorBlock key={link.id} nodeId={blockNodeId} label="Collection link">
            <Link to={to} style={linkItemStyle}>
              <EditorField fieldPath={`${blockBase}.title`} label="Title">
                {link.title}
              </EditorField>
              <sup style={countStyle}>
                <EditorField fieldPath={`${blockBase}.productCount`} label="Product count">
                  {link.productCount}
                </EditorField>
              </sup>
            </Link>
          </EditorBlock>
        );
      })}
    </div>
  );

  const mediaColumn = (
    <div
      style={{
        flex: '1 1 52%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ececec',
        minHeight: 280,
        padding: 24,
      }}
    >
      {layoutStyle.imageUrl ? (
        <img
          src={layoutStyle.imageUrl}
          alt=""
          style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain' }}
        />
      ) : (
        <CollectionLinksSpotlightArt />
      )}
    </div>
  );

  const linksColumn = (
    <div
      style={{
        flex: '1 1 48%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 32px',
        borderRight: layoutStyle.imagePosition === 'right' ? '1px solid #f3f4f6' : undefined,
        borderLeft: layoutStyle.imagePosition === 'left' ? '1px solid #f3f4f6' : undefined,
      }}
    >
      {linksList}
    </div>
  );

  return (
    <EditorSection
      sectionId={sectionId}
      label={sectionLabel}
      editorNodeId={editorNodeId}
      style={outerStyle}
    >
      {customCss ? <style>{customCss}</style> : null}
      <div style={innerStyle}>
        {isTextLayout ? (
          linksList
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: layoutStyle.imagePosition === 'left' ? 'row-reverse' : 'row',
              minHeight: 280,
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            {linksColumn}
            {mediaColumn}
          </div>
        )}
      </div>
    </EditorSection>
  );
}
