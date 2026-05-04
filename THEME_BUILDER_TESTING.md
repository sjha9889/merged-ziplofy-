# Theme Builder Unit Testing Guide

This document describes how to run, write, and maintain unit tests for the theme builder (Ziplofy and Ziplofy3b theme-related code). For general testing patterns and the admin panel tests, see [TESTING.md](TESTING.md).

## Prerequisites

- Node.js 18+
- For Ziplofy3b backend tests: `ACCESS_TOKEN_SECRET` and `SUPER_ADMIN_TOKEN` are set in `Ziplofy3b/src/test/setup.ts`
- For Ziplofy: `VITE_API_URL` is optional (used by custom-themes context)

## Running Tests

### Ziplofy (Theme Builder UI)

```bash
cd Ziplofy
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

### Ziplofy3b (Theme API)

```bash
cd Ziplofy3b
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

### Run Both

```bash
cd Ziplofy && npm run test:run && cd ../Ziplofy3b && npm run test:run
```

## Test Coverage

### Ziplofy

| File | Tests | Description |
|------|-------|-------------|
| `visualElementorThemeUtils.test.ts` | stripGrapesJSCanvasCss, preprocessHtmlForSelectability, cleanupCssGradients, removeEmptyTags, sanitizeBlockContentForAppend, isContentCssNotHtml | Theme HTML/CSS utility functions |
| `custom-themes.context.test.tsx` | CustomThemesProvider, fetchAll, useCustomThemes error | Custom themes context and API calls |

### Ziplofy3b

| File | Tests | Description |
|------|-------|-------------|
| `custom-theme.controller.test.ts` | createCustomTheme validation, getCustomThemes, getCustomTheme | Custom theme API validation and auth |
| `theme.controller.test.ts` | getThemes filter and pagination | Theme list API |
| `custom-theme.route.test.ts` | GET /api/custom-themes auth | Route integration |
| `theme.route.test.ts` | GET /api/themes public | Route integration |

## How to Add Tests

### Naming and Location

- Use `*.test.ts` or `*.test.tsx` next to the source file
- Examples:
  - `visualElementorThemeUtils.ts` → `visualElementorThemeUtils.test.ts`
  - `custom-themes.context.tsx` → `custom-themes.context.test.tsx`

### Ziplofy – Utils

```ts
// visualElementorThemeUtils.test.ts
import { describe, it, expect } from 'vitest';
import { stripGrapesJSCanvasCss } from './visualElementorThemeUtils';

describe('stripGrapesJSCanvasCss', () => {
  it('returns input when empty', () => {
    expect(stripGrapesJSCanvasCss('')).toBe('');
  });
});
```

### Ziplofy – Context with Mocks

```tsx
vi.mock('../config/axios.config', () => ({
  axiosi: { get: vi.fn(), post: vi.fn() },
}));
```

### Ziplofy3b – Controller

```ts
vi.mock('../models/custom-theme.model', () => ({
  CustomTheme: { find: vi.fn(), findOne: vi.fn() },
}));
```

### Ziplofy3b – Route (Supertest)

```ts
const app = express();
app.use('/api/custom-themes', customThemeRouter);
app.use(errorMiddleware);

const res = await request(app).get('/api/custom-themes').set('Authorization', 'Bearer token');
expect(res.status).toBe(200);
```

## Mocking Patterns

### Ziplofy

| Target | Approach |
|--------|----------|
| axios (axiosi) | `vi.mock('../config/axios.config', () => ({ axiosi: { get: vi.fn(), ... } }))` |
| react-hot-toast | `vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))` |

### Ziplofy3b

| Target | Approach |
|--------|----------|
| CustomTheme | `vi.mock('../models/custom-theme.model', () => ({ CustomTheme: { find: vi.fn(), ... } }))` |
| Theme | `vi.mock('../models/theme.model', () => ({ Theme: { find: vi.fn(), countDocuments: vi.fn() } }))` |
| Auth | Use `SUPER_ADMIN_TOKEN` in `Authorization: Bearer` header for protected routes |

## File Layout

```
Ziplofy/
├── src/
│   ├── test/setup.ts
│   ├── pages/themes/visualElementorThemeUtils.test.ts
│   └── contexts/custom-themes.context.test.tsx
└── vite.config.js (with test block)

Ziplofy3b/
├── src/
│   ├── controllers/
│   │   ├── custom-theme.controller.test.ts
│   │   └── theme.controller.test.ts
│   └── routes/
│       ├── custom-theme.route.test.ts
│       └── theme.route.test.ts
└── vitest.config.ts
```

## Notes

- CustomThemeBuilder (GrapesJS) is not unit-tested; focus on utils and API.
- custom-theme.controller createCustomTheme uses fs and extract-zip; tests cover validation and auth only.
- See [TESTING.md](TESTING.md) for shared patterns (renderWithProviders, env setup, CI).
