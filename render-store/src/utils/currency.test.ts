import { describe, expect, it } from 'vitest';
import { formatINR } from './currency';

describe('formatINR', () => {
  it('formats whole rupees correctly', () => {
    expect(formatINR(10000)).toBe('₹100.00');
    expect(formatINR(0)).toBe('₹0.00');
  });

  it('formats rupees with paise correctly', () => {
    expect(formatINR(10050)).toBe('₹100.50');
    expect(formatINR(12345)).toBe('₹123.45');
  });
});

import { describe, expect, it } from 'vitest';
import { formatINR } from './currency';

describe('formatINR', () => {
  it('formats paisa to INR display string', () => {
    expect(formatINR(10050)).toBe('₹100.50');
  });

  it('formats zero correctly', () => {
    expect(formatINR(0)).toBe('₹0.00');
  });

  it('formats whole rupees correctly', () => {
    expect(formatINR(10000)).toBe('₹100.00');
  });

  it('formats large amounts with proper decimals', () => {
    expect(formatINR(99999)).toBe('₹999.99');
  });
});
