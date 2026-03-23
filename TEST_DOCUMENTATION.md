# Test Documentation

This document provides a complete summary of all unit tests across the project: what they test, how many exist, and how many pass.

---

## Summary

| Project | Total Tests | Passed | Failed | Status |
|---------|-------------|--------|--------|--------|
| **frontend** (Admin Panel) | 17 | 17 | 0 | Pass |
| **Ziplofy** (Theme Builder UI) | 33 | 33 | 0 | Pass |
| **Ziplofy3b** (Backend) | 41 | 41 | 0 | Pass |
| **Grand Total** | **91** | **91** | **0** | **Pass** |

---

## 1. Admin Panel Frontend (17 tests, 17 passed)

| File | Tests | Description |
|------|-------|-------------|
| `frontend/src/hooks/useDebounce.test.ts` | 5 | Debounce hook: initial value, delayed update, unmount cleanup, numeric values |
| `frontend/src/Components/AdminProtectedRoute.test.tsx` | 3 | Route protection: renders when authed, redirects when not |
| `frontend/src/Components/pages/AdminLogin.test.tsx` | 5 | Login form: render, submit, navigate, error display, loading state |
| `frontend/src/config/axios.test.ts` | 4 | Axios config: export, auth header, 401 clears localStorage |

---

## 2. Theme Builder – Ziplofy (33 tests, 33 passed)

| File | Tests | Description |
|------|-------|-------------|
| `Ziplofy/src/pages/themes/visualElementorThemeUtils.test.ts` | 28 | Theme utils: stripGrapesJSCanvasCss, preprocessHtmlForSelectability, cleanupCssGradients, removeEmptyTags, sanitizeBlockContentForAppend, isContentCssNotHtml |
| `Ziplofy/src/contexts/custom-themes.context.test.tsx` | 5 | Custom themes context: provider, fetchAll, success/error states, useCustomThemes error |

---

## 3. Backend – Ziplofy3b (41 tests, 41 passed)

### Admin Panel & Auth (27 tests)

| File | Tests | Description |
|------|-------|-------------|
| `src/utils/error.utils.test.ts` | 5 | CustomError, asyncErrorHandler |
| `src/middlewares/error.middleware.test.ts` | 5 | CustomError, CastError, duplicate key, ValidationError, unknown error |
| `src/middlewares/auth.middleware.test.ts` | 9 | protect (token, Bearer, super-admin, JWT), authorize (no user, super-admin, role check) |
| `src/controllers/auth.controller.test.ts` | 5 | adminLogin validation and success |
| `src/routes/auth.route.test.ts` | 3 | POST /api/auth/admin/login: 400, 401, 200 |

### Theme Builder API (14 tests)

| File | Tests | Description |
|------|-------|-------------|
| `src/controllers/custom-theme.controller.test.ts` | 8 | createCustomTheme (400 name/zip, 401), getCustomThemes (401, 200), getCustomTheme (400, 401, 404) |
| `src/controllers/theme.controller.test.ts` | 2 | getThemes filter and pagination |
| `src/routes/custom-theme.route.test.ts` | 2 | GET /api/custom-themes: 401 without auth, 200 with auth |
| `src/routes/theme.route.test.ts` | 2 | GET /api/themes: 200 public, paginated response |

---

## Test Count by Project

| Project | Test Files | Total Tests | Passed |
|---------|------------|-------------|--------|
| frontend | 4 | 17 | 17 |
| Ziplofy | 2 | 33 | 33 |
| Ziplofy3b | 9 | 41 | 41 |

---

## How to Run Tests

```bash
# Admin panel frontend
cd frontend && npm run test:run

# Theme builder UI
cd Ziplofy && npm run test:run

# Backend (admin + theme API)
cd Ziplofy3b && npm run test:run

# All tests
cd frontend && npm run test:run && cd ../Ziplofy && npm run test:run && cd ../Ziplofy3b && npm run test:run
```

---

## References

- [TESTING.md](TESTING.md) – Admin panel testing guide, mocking patterns
- [THEME_BUILDER_TESTING.md](THEME_BUILDER_TESTING.md) – Theme builder testing guide
- [TEST_RESULTS.md](TEST_RESULTS.md) – Detailed admin panel test descriptions
