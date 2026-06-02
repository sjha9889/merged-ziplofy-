/** Shopify-style defaults for FAQ sections. */

const DEFAULT_FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What is the return policy?',
    answer:
      'We offer a 30-day return policy on most items. Products must be unused and in original packaging.',
  },
  {
    question: 'Are any purchases final sale?',
    answer: 'Yes, items marked final sale cannot be returned or exchanged.',
  },
  {
    question: 'When will I get my order?',
    answer: 'Most orders ship within 2–3 business days. Delivery times vary by location.',
  },
  {
    question: 'Where are your products manufactured?',
    answer: 'Our products are designed in-house and manufactured with trusted partners worldwide.',
  },
  {
    question: 'How much does shipping cost?',
    answer: 'Shipping is calculated at checkout. Free shipping may apply on qualifying orders.',
  },
];

export function applyFaqPreset(section: Record<string, unknown>): void {
  if (section.type !== 'faq') return;

  const settings = (section.settings ?? {}) as Record<string, unknown>;
  settings.catalogVariant = 'faq';
  settings.heading = settings.heading ?? 'Frequently asked questions';
  settings.openFirstItem = settings.openFirstItem ?? false;
  settings.direction = settings.direction ?? 'vertical';
  settings.layoutAlignment = settings.layoutAlignment ?? settings.headingAlignment ?? 'left';
  settings.position = settings.position ?? 'center';
  settings.layoutGap = settings.layoutGap ?? 32;
  settings.sectionWidth = settings.sectionWidth ?? 'page';
  settings.height = settings.height ?? 'auto';
  settings.colorScheme = settings.colorScheme ?? 'scheme-1';
  settings.backgroundMedia = settings.backgroundMedia ?? 'none';
  settings.backgroundImageUrl = settings.backgroundImageUrl ?? '';
  settings.borderStyle = settings.borderStyle ?? 'none';
  settings.cornerRadius = settings.cornerRadius ?? 0;
  settings.backgroundOverlay = settings.backgroundOverlay ?? false;
  settings.paddingTop = settings.paddingTop ?? 48;
  settings.paddingBottom = settings.paddingBottom ?? 48;
  settings.customCss = settings.customCss ?? '';
  delete settings.headingAlignment;
  section.settings = settings;

  const blocks: Record<string, Record<string, unknown>> = {};
  const block_order: string[] = [];
  DEFAULT_FAQ_ITEMS.forEach((item, i) => {
    const id = `faq_${i + 1}`;
    blocks[id] = {
      type: 'faq-item',
      settings: { question: item.question, answer: item.answer },
    };
    block_order.push(id);
  });
  section.blocks = blocks;
  section.block_order = block_order;
}
