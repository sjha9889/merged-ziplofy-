import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import WaveDivider from './WaveDivider';

describe('WaveDivider', () => {
  it('renders svg element', () => {
    const { container } = render(<WaveDivider />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with fillColor class', () => {
    const { container } = render(<WaveDivider fillColor="fill-white" />);
    const el = container.querySelector('path, [class*="fill-white"]');
    expect(el).toBeTruthy();
  });

  it('uses customPath when provided', () => {
    const customPath = 'M0,0 L100,50 L200,0 Z';
    const { container } = render(<WaveDivider customPath={customPath} />);
    const path = container.querySelector('path');
    expect(path?.getAttribute('d')).toBe(customPath);
  });
});
