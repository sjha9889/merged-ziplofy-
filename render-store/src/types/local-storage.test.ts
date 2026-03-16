import { describe, expect, it, beforeEach } from 'vitest';
import { safeLocalStorage } from './local-storage';

describe('safeLocalStorage', () => {
  beforeEach(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('ziplofy_guest_cart');
      }
    } catch {
      // ignore
    }
  });

  it('getItem returns null for missing key', () => {
    expect(safeLocalStorage.getItem('accessToken')).toBeNull();
  });

  it('setItem and getItem work', () => {
    safeLocalStorage.setItem('accessToken', 'abc');
    expect(safeLocalStorage.getItem('accessToken')).toBe('abc');
  });

  it('removeItem removes value', () => {
    safeLocalStorage.setItem('accessToken', 'abc');
    safeLocalStorage.removeItem('accessToken');
    expect(safeLocalStorage.getItem('accessToken')).toBeNull();
  });

  it('clear removes all values', () => {
    safeLocalStorage.setItem('accessToken', 'a');
    safeLocalStorage.setItem('ziplofy_guest_cart', '[]');
    safeLocalStorage.clear();
    expect(safeLocalStorage.getItem('accessToken')).toBeNull();
    expect(safeLocalStorage.getItem('ziplofy_guest_cart')).toBeNull();
  });
});
