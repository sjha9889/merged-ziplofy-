import type { CreateThemeBlockEditing } from '../types';

export const editing: CreateThemeBlockEditing = {
  "blockId": "heading",
  "label": "Text",
  "settingsOrder": [
    {
      "key": "heading",
      "label": "Text",
      "type": "textarea"
    },
    {
      "key": "headingWidth",
      "label": "Width",
      "type": "text"
    },
    {
      "key": "headingMaxWidth",
      "label": "Max width",
      "type": "text"
    },
    {
      "key": "headingAlignment",
      "label": "Alignment",
      "type": "text"
    },
    {
      "key": "headingTypographyPreset",
      "label": "Preset",
      "type": "text"
    },
    {
      "key": "headingColor",
      "label": "Color",
      "type": "text"
    },
    {
      "key": "headingBackgroundEnabled",
      "label": "Background",
      "type": "boolean"
    },
    {
      "key": "headingBackgroundColor",
      "label": "Background color",
      "type": "color"
    },
    {
      "key": "headingCornerRadius",
      "label": "Corner radius",
      "type": "number"
    },
    {
      "key": "headingPaddingTop",
      "label": "Top",
      "type": "number"
    },
    {
      "key": "headingPaddingBottom",
      "label": "Bottom",
      "type": "number"
    },
    {
      "key": "headingPaddingLeft",
      "label": "Left",
      "type": "number"
    },
    {
      "key": "headingPaddingRight",
      "label": "Right",
      "type": "number"
    }
  ]
};
