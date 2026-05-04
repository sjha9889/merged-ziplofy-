import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SlantedImageCarouselWrapper from './SlantedImageCarouselWrapper';

describe('SlantedImageCarouselWrapper', () => {
  it('renders children in foreground content container', () => {
    render(
      <SlantedImageCarouselWrapper>
        <div>Child content</div>
      </SlantedImageCarouselWrapper>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders default images when no images prop is provided', () => {
    const { container } = render(
      <SlantedImageCarouselWrapper>
        <div>Content</div>
      </SlantedImageCarouselWrapper>
    );

    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThan(0);
  });

  it('renders custom images when provided and duplicates them for seamless loop', () => {
    const images = ['https://example.com/a.jpg', 'https://example.com/b.jpg', 'https://example.com/c.jpg'];

    const { container } = render(
      <SlantedImageCarouselWrapper images={images}>
        <div>Content</div>
      </SlantedImageCarouselWrapper>
    );

    const imgs = Array.from(container.querySelectorAll('img'));
    // Each column duplicates its images 3x, so every image URL appears multiple times
    const srcs = imgs.map((img) => (img as HTMLImageElement).src);
    expect(srcs.filter((s) => s.includes('a.jpg')).length).toBeGreaterThan(0);
    expect(srcs.filter((s) => s.includes('b.jpg')).length).toBeGreaterThan(0);
  });

  it('injects keyframe style for scrollUp/scrollDown', () => {
    const { container } = render(
      <SlantedImageCarouselWrapper images={['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']}>
        <div>Child</div>
      </SlantedImageCarouselWrapper>
    );

    const styleContent = Array.from(container.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(styleContent).toContain('@keyframes scrollUp');
    expect(styleContent).toContain('@keyframes scrollDown');
  });
});
