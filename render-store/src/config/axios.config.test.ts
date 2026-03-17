import { describe, expect, it, vi, beforeEach } from 'vitest';

type RequestUseHandler = (config: { headers: Record<string, string> }) => unknown;

describe('axios.config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('creates axios instance with baseURL `${VITE_API_URL}/api` and withCredentials true', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com');

    const createSpy = vi.fn(() => ({
      interceptors: { request: { use: vi.fn() } },
    }));

    vi.doMock('axios', () => ({
      default: { create: (...args: unknown[]) => createSpy(...args) },
    }));

    vi.doMock('../types/local-storage', () => ({
      safeLocalStorage: { getItem: vi.fn(() => null) },
    }));

    await import('./axios.config');

    expect(createSpy).toHaveBeenCalledTimes(1);
    const configArg = createSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(configArg.baseURL).toBe('https://api.example.com/api');
    expect(configArg.withCredentials).toBe(true);
  });

  it('request interceptor adds Authorization header when accessToken exists', async () => {
    const requestUseSpy = vi.fn();
    const createSpy = vi.fn(() => ({
      interceptors: { request: { use: (...args: unknown[]) => requestUseSpy(...args) } },
    }));

    vi.doMock('axios', () => ({
      default: { create: (...args: unknown[]) => createSpy(...args) },
    }));

    const getItem = vi.fn(() => 'tok123');
    vi.doMock('../types/local-storage', () => ({
      safeLocalStorage: { getItem },
    }));

    await import('./axios.config');

    expect(requestUseSpy).toHaveBeenCalledTimes(1);
    const fulfilled = requestUseSpy.mock.calls[0]?.[0] as RequestUseHandler;
    const cfg = { headers: {} as Record<string, string> };
    const out = fulfilled(cfg) as typeof cfg;
    expect(out.headers.Authorization).toBe('Bearer tok123');
  });

  it('request interceptor leaves Authorization undefined when no token', async () => {
    const requestUseSpy = vi.fn();
    const createSpy = vi.fn(() => ({
      interceptors: { request: { use: (...args: unknown[]) => requestUseSpy(...args) } },
    }));

    vi.doMock('axios', () => ({
      default: { create: (...args: unknown[]) => createSpy(...args) },
    }));

    const getItem = vi.fn(() => null);
    vi.doMock('../types/local-storage', () => ({
      safeLocalStorage: { getItem },
    }));

    await import('./axios.config');

    const fulfilled = requestUseSpy.mock.calls[0]?.[0] as RequestUseHandler;
    const cfg = { headers: {} as Record<string, string> };
    const out = fulfilled(cfg) as typeof cfg;
    expect(out.headers.Authorization).toBeUndefined();
  });
});

import { describe, expect, it, vi, beforeEach } from 'vitest';

type RequestUseHandler = (config: { headers: Record<string, string> }) => unknown;

describe('axios.config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('creates instance with baseURL from VITE_API_URL and withCredentials', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000');
    const createSpy = vi.fn(() => ({ interceptors: { request: { use: vi.fn() } } }));
    vi.doMock('axios', () => ({ default: { create: (...args: unknown[]) => createSpy(...args) } }));
    vi.doMock('../types/local-storage', () => ({ safeLocalStorage: { getItem: vi.fn(() => null) } }));

    await import('./axios.config');

    expect(createSpy).toHaveBeenCalledTimes(1);
    const arg = createSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(arg.baseURL).toBe('http://localhost:5000/api');
    expect(arg.withCredentials).toBe(true);
  });

  it('adds Authorization header when accessToken exists', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000');
    const requestUseSpy = vi.fn();
    const createSpy = vi.fn(() => ({
      interceptors: { request: { use: (...args: unknown[]) => requestUseSpy(...args) } },
    }));
    vi.doMock('axios', () => ({ default: { create: (...args: unknown[]) => createSpy(...args) } }));
    const getItem = vi.fn(() => 'tok123');
    vi.doMock('../types/local-storage', () => ({ safeLocalStorage: { getItem } }));

    await import('./axios.config');

    const fulfilled = requestUseSpy.mock.calls[0]?.[0] as RequestUseHandler;
    const cfg = { headers: {} as Record<string, string> };
    const out = fulfilled(cfg) as typeof cfg;
    expect(out.headers.Authorization).toBe('Bearer tok123');
  });

  it('does not add Authorization when token missing', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000');
    const requestUseSpy = vi.fn();
    const createSpy = vi.fn(() => ({
      interceptors: { request: { use: (...args: unknown[]) => requestUseSpy(...args) } },
    }));
    vi.doMock('axios', () => ({ default: { create: (...args: unknown[]) => createSpy(...args) } }));
    vi.doMock('../types/local-storage', () => ({ safeLocalStorage: { getItem: vi.fn(() => null) } }));

    await import('./axios.config');

    const fulfilled = requestUseSpy.mock.calls[0]?.[0] as RequestUseHandler;
    const cfg = { headers: {} as Record<string, string> };
    const out = fulfilled(cfg) as typeof cfg;
    expect(out.headers.Authorization).toBeUndefined();
  });
});
