import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SlantedImageCarouselWrapper from './SlantedImageCarouselWrapper';

describe('SlantedImageCarouselWrapper', () => {
  it('renders children', () => {
    render(
      <SlantedImageCarouselWrapper>
        <div>Child content</div>
      </SlantedImageCarouselWrapper>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
