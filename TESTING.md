# Admin Panel Unit Testing Guide

This document describes how to run, write, and maintain unit tests for the admin panel (frontend and Ziplofy3b backend).

## Overview

| Project    | Test Runner | Key Libraries | Scope                    |
|-----------|-------------|---------------|--------------------------|
| frontend  | Vitest      | React Testing Library, jsdom | Platform admin UI    |
| Ziplofy3b | Vitest      | Supertest     | Backend API (Express)    |

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- For backend tests: `ACCESS_TOKEN_SECRET` and `SUPER_ADMIN_TOKEN` are set automatically in `Ziplofy3b/src/test/setup.ts`; override via env if needed
- For frontend: `VITE_BACKEND_URL` is optional for tests (used by axios config)

## Running Tests

### Frontend (Platform Admin)

```bash
cd frontend
npm run test          # Watch mode – runs tests on file changes
npm run test:run      # Single run
npm run test:ui       # Vitest UI (interactive)
npm run test:coverage # Coverage report (requires @vitest/coverage-v8)
```

### Backend (Ziplofy3b)

```bash
cd Ziplofy3b
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

### Run Both

```bash
cd frontend && npm run test:run && cd ../Ziplofy3b && npm run test:run
```

## How to Add a New Test

### Naming and Location

- Use `*.test.ts` or `*.test.tsx` next to the source file or in a `__tests__` folder.
- Examples:
  - `useDebounce.ts` → `useDebounce.test.ts`
  - `AdminLogin.tsx` → `AdminLogin.test.tsx` (or `pages/__tests__/AdminLogin.test.tsx`)

### Frontend Test Example

```tsx
// useExample.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Example from './Example';

describe('Example', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Backend Test Example

```ts
// example.controller.test.ts
import { describe, it, expect, vi } from 'vitest';
import { exampleHandler } from './example.controller';

vi.mock('../models/example.model', () => ({
  Example: { find: vi.fn() },
}));

describe('exampleHandler', () => {
  it('returns data on success', async () => {
    // ... mock req, res, call handler, assert
  });
});
```

### Supertest (Route) Example

```ts
// example.route.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { exampleRouter } from './example.route';
import { errorMiddleware } from '../middlewares/error.middleware';

const app = express();
app.use(express.json());
app.use('/api/example', exampleRouter);
app.use(errorMiddleware);

describe('GET /api/example', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/example');
    expect(res.status).toBe(200);
  });
});
```

## Mocking Patterns

### Frontend

| Target        | Approach                                                         |
|---------------|------------------------------------------------------------------|
| axios         | `vi.mock('../config/axios')` or mock `localStorage` and adapter |
| useAdminAuth  | `vi.mock('../contexts/admin-auth.context', () => ({ useAdminAuth: vi.fn() }))` |
| localStorage  | Replace `global.localStorage` with object providing `getItem`, `setItem`, `removeItem` |
| Router        | Use `MemoryRouter` or `BrowserRouter` from `react-router-dom`    |

### Backend

| Target        | Approach                                                         |
|---------------|------------------------------------------------------------------|
| Mongoose      | `vi.mock('../models/user.model', () => ({ User: { findOne: vi.fn(), ... } }))` |
| JWT           | `vi.mock('jsonwebtoken', () => ({ default: { sign: vi.fn(), verify: vi.fn() } }))` |
| bcrypt        | `vi.mock('bcryptjs', () => ({ default: { compare: vi.fn() } }))` |
| Env           | Set `process.env.ACCESS_TOKEN_SECRET` in `beforeEach` or setup   |

## Test Structure

```
frontend/src/
├── test/
│   ├── setup.ts
│   └── utils.tsx
├── hooks/
│   └── useDebounce.test.ts
├── Components/
│   ├── AdminProtectedRoute.test.tsx
│   └── pages/
│       └── AdminLogin.test.tsx
└── config/
    └── axios.test.ts

Ziplofy3b/src/
├── test/
│   └── setup.ts
├── utils/
│   └── error.utils.test.ts
├── middlewares/
│   ├── error.middleware.test.ts
│   └── auth.middleware.test.ts
├── controllers/
│   └── auth.controller.test.ts
└── routes/
    └── auth.route.test.ts
```

## CI Integration

Example GitHub Actions:

```yaml
- name: Run frontend tests
  run: cd frontend && npm run test:run

- name: Run backend tests
  run: cd Ziplofy3b && npm run test:run
```

## Coverage Goals

- Aim for 70%+ coverage on critical paths: auth, error handling, key hooks/components.
- Run `npm run test:coverage` in each project to generate reports.
