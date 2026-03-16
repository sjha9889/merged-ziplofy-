import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
}
Object.defineProperty(globalThis, 'IntersectionObserver', { value: MockIntersectionObserver, writable: true });
Object.defineProperty(globalThis, 'scrollTo', { value: vi.fn(), writable: true });

// Polyfill localStorage for tests (vitest/jsdom may have limited support)
const storage: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => storage[k] ?? null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => { for (const k of Object.keys(storage)) delete storage[k]; },
    length: 0,
    key: () => null,
  },
  writable: true,
});
