import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(__dirname, '../src/theme-packs/horizon');
const schemaPath = path.join(packDir, 'theme.schema.json');
const defaultPath = path.join(packDir, 'theme.default-config.json');
const manifestPath = path.join(packDir, 'theme.manifest.json');

const COLOR_SCHEME_OPTIONS = [
  { value: 'scheme-1', label: 'Scheme 1' },
  { value: 'scheme-2', label: 'Scheme 2' },
  { value: 'scheme-3', label: 'Scheme 3' },
  { value: 'scheme-4', label: 'Scheme 4' },
];

/** Sidebar settings: Layout → Size → Appearance → Padding → Custom CSS (Horizon FAQ sheet). */
function sectionSettingsFields(prefix) {
  return [
    {
      path: `${prefix}.heading`,
      type: 'text',
      label: 'Heading',
      group: 'General',
      sidebar: false,
    },
    {
      path: `${prefix}.openFirstItem`,
      type: 'boolean',
      label: 'Open first row',
      group: 'General',
      sidebar: false,
    },
    {
      path: `${prefix}.direction`,
      type: 'select',
      label: 'Direction',
      group: 'Layout',
      widget: 'segmented',
      sidebar: true,
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
      ],
    },
    {
      path: `${prefix}.layoutAlignment`,
      type: 'select',
      label: 'Alignment',
      group: 'Layout',
      widget: 'segmented',
      sidebar: true,
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
    {
      path: `${prefix}.position`,
      type: 'select',
      label: 'Position',
      group: 'Layout',
      widget: 'select-inline',
      sidebar: true,
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
    },
    {
      path: `${prefix}.layoutGap`,
      type: 'number',
      label: 'Gap',
      group: 'Layout',
      widget: 'slider',
      min: 0,
      max: 100,
      step: 1,
      unit: 'px',
      sidebar: true,
    },
    {
      path: `${prefix}.sectionWidth`,
      type: 'select',
      label: 'Width',
      group: 'Size',
      widget: 'segmented',
      sidebar: true,
      options: [
        { value: 'page', label: 'Page' },
        { value: 'full', label: 'Full' },
      ],
    },
    {
      path: `${prefix}.height`,
      type: 'select',
      label: 'Height',
      group: 'Size',
      widget: 'select-inline',
      sidebar: true,
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
    {
      path: `${prefix}.colorScheme`,
      type: 'select',
      label: 'Color scheme',
      group: 'Appearance',
      widget: 'color-scheme',
      sidebar: true,
      options: COLOR_SCHEME_OPTIONS,
    },
    {
      path: `${prefix}.backgroundMedia`,
      type: 'select',
      label: 'Background media',
      group: 'Appearance',
      widget: 'select-inline',
      sidebar: true,
      options: [
        { value: 'none', label: 'None' },
        { value: 'image', label: 'Image' },
      ],
    },
    {
      path: `${prefix}.backgroundImageUrl`,
      type: 'text',
      label: 'Background image',
      group: 'Appearance',
      sidebar: true,
      placeholder: 'Paste image URL or upload',
    },
    {
      path: `${prefix}.borderStyle`,
      type: 'select',
      label: 'Borders',
      group: 'Appearance',
      widget: 'segmented',
      sidebar: true,
      options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
      ],
    },
    {
      path: `${prefix}.cornerRadius`,
      type: 'number',
      label: 'Corner radius',
      group: 'Appearance',
      widget: 'slider',
      min: 0,
      max: 40,
      step: 1,
      unit: 'px',
      sidebar: true,
    },
    {
      path: `${prefix}.backgroundOverlay`,
      type: 'boolean',
      label: 'Background overlay',
      group: 'Appearance',
      sidebar: true,
    },
    {
      path: `${prefix}.paddingTop`,
      type: 'number',
      label: 'Top',
      group: 'Padding',
      widget: 'slider',
      min: 0,
      max: 120,
      step: 1,
      unit: 'px',
      sidebar: true,
    },
    {
      path: `${prefix}.paddingBottom`,
      type: 'number',
      label: 'Bottom',
      group: 'Padding',
      widget: 'slider',
      min: 0,
      max: 120,
      step: 1,
      unit: 'px',
      sidebar: true,
    },
    {
      path: `${prefix}.customCss`,
      type: 'textarea',
      label: 'Custom CSS',
      group: 'Custom CSS',
      widget: 'accordion',
      sidebar: true,
    },
  ];
}

function faqBlocks(prefix) {
  return [
    {
      id: 'faq_item',
      label: 'Question',
      settingsFields: [
        {
          path: `${prefix}.blocks.faq_item.settings.question`,
          type: 'text',
          label: 'Question',
          group: 'Content',
          sidebar: true,
        },
        {
          path: `${prefix}.blocks.faq_item.settings.answer`,
          type: 'textarea',
          label: 'Answer',
          group: 'Content',
          sidebar: true,
        },
      ],
    },
  ];
}

const layoutFaq = {
  label: 'FAQ',
  description: 'Accordion frequently asked questions.',
  settingsFields: sectionSettingsFields('sections.faq_section.settings'),
  blocks: faqBlocks('sections.faq_section'),
};

const templateFaq = {
  id: 'faq_section',
  type: 'faq',
  label: 'FAQ',
  hasBlocks: true,
  settingsFields: sectionSettingsFields('templates.index.sections.faq_section.settings'),
  blocks: faqBlocks('templates.index.sections.faq_section'),
};

const defaultFaqSection = {
  type: 'faq',
  enabled: true,
  settings: {
    catalogVariant: 'faq',
    heading: 'Frequently asked questions',
    openFirstItem: false,
    direction: 'vertical',
    layoutAlignment: 'left',
    position: 'center',
    layoutGap: 32,
    sectionWidth: 'page',
    height: 'auto',
    colorScheme: 'scheme-1',
    backgroundMedia: 'none',
    backgroundImageUrl: '',
    borderStyle: 'none',
    cornerRadius: 0,
    backgroundOverlay: false,
    paddingTop: 48,
    paddingBottom: 48,
    customCss: '',
  },
  blocks: {
    faq_1: {
      type: 'faq-item',
      settings: {
        question: 'What is the return policy?',
        answer:
          'We offer a 30-day return policy on most items. Products must be unused and in original packaging.',
      },
    },
    faq_2: {
      type: 'faq-item',
      settings: {
        question: 'Are any purchases final sale?',
        answer: 'Yes, items marked final sale cannot be returned or exchanged.',
      },
    },
    faq_3: {
      type: 'faq-item',
      settings: {
        question: 'When will I get my order?',
        answer: 'Most orders ship within 2–3 business days. Delivery times vary by location.',
      },
    },
    faq_4: {
      type: 'faq-item',
      settings: {
        question: 'Where are your products manufactured?',
        answer:
          'Our products are designed in-house and manufactured with trusted partners worldwide.',
      },
    },
    faq_5: {
      type: 'faq-item',
      settings: {
        question: 'How much does shipping cost?',
        answer: 'Shipping is calculated at checkout. Free shipping may apply on qualifying orders.',
      },
    },
  },
  block_order: ['faq_1', 'faq_2', 'faq_3', 'faq_4', 'faq_5'],
};

function patchSchema(schema) {
  schema.layout = schema.layout ?? {};
  schema.layout.faq_section = layoutFaq;

  const indexTpl = schema.templates?.find((t) => t.id === 'index');
  if (!indexTpl) throw new Error('index template missing');
  const existing = indexTpl.sections?.findIndex((s) => s.id === 'faq_section');
  if (existing >= 0) {
    indexTpl.sections[existing] = templateFaq;
  } else {
    const dividerIdx = indexTpl.sections?.findIndex((s) => s.id === 'divider') ?? -1;
    if (dividerIdx >= 0) indexTpl.sections.splice(dividerIdx, 0, templateFaq);
    else indexTpl.sections.push(templateFaq);
  }
}

function patchDefaultConfig(cfg) {
  const index = cfg.templates?.index;
  if (!index?.sections) throw new Error('templates.index missing');
  index.sections.faq_section = defaultFaqSection;
}

function patchManifest(manifest) {
  manifest.sectionBlocks = manifest.sectionBlocks ?? {};
  manifest.sectionBlocks.faq = ['faq-item'];
}

for (const target of [schemaPath, defaultPath, manifestPath]) {
  const data = JSON.parse(fs.readFileSync(target, 'utf8'));
  if (target.endsWith('theme.schema.json')) patchSchema(data);
  else if (target.endsWith('theme.default-config.json')) patchDefaultConfig(data);
  else patchManifest(data);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  console.log('patched', target);
}

const z3b = path.join(__dirname, '../../Ziplofy3b/src/theme-packs/horizon');
for (const name of ['theme.schema.json', 'theme.default-config.json', 'theme.manifest.json']) {
  const dest = path.join(z3b, name);
  if (fs.existsSync(path.dirname(dest))) {
    fs.copyFileSync(path.join(packDir, name), dest);
    console.log('copied to', dest);
  }
}
