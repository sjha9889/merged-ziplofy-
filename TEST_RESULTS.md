# Admin Panel Test Results Documentation

This document provides a detailed breakdown of all unit tests for the admin panel (frontend and Ziplofy3b backend), including what each test does and the overall pass/fail summary.

---

## Overview

| Project   | Total Tests | Passed | Failed | Status |
|-----------|-------------|--------|--------|--------|
| Frontend  | 17          | 17     | 0      | Pass   |
| Backend   | 27          | 27     | 0      | Pass   |
| **Total** | **44**      | **44** | **0**  | **Pass** |

---

## Frontend Tests (17 total)

### 1. `useDebounce.test.ts` — 5 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Returns initial value immediately | Ensures the hook returns the initial value on first render |
| 2 | Returns debounced value after delay | Value updates only after the specified delay elapses |
| 3 | Clears timeout on unmount | No memory leaks when the component unmounts |
| 4 | Updates when value changes and delay elapses | Multiple value changes; only the latest propagates after delay |
| 5 | Works with numeric values | Hook handles non-string types correctly |

**File:** `frontend/src/hooks/useDebounce.test.ts`

---

### 2. `AdminProtectedRoute.test.tsx` — 3 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Renders children when user and token exist | Protected content is shown when the user is authenticated |
| 2 | Redirects to /admin/login when no token | Unauthenticated users are redirected to the login page |
| 3 | Redirects to /admin/login when no user | Missing user data also triggers a redirect to login |

**File:** `frontend/src/Components/AdminProtectedRoute.test.tsx`

---

### 3. `AdminLogin.test.tsx` — 5 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Renders email and password fields and submit button | Login form UI is present |
| 2 | Calls login with email and password on form submit | Form submission invokes the login handler with correct values |
| 3 | Navigates to dashboard on successful login | Redirects to `/admin/dashboard` after successful authentication |
| 4 | Displays error when login fails | Error message is shown when login API returns an error |
| 5 | Disables submit button when loading | Button is disabled during the login request to prevent double submission |

**File:** `frontend/src/Components/pages/AdminLogin.test.tsx`

---

### 4. `axios.test.ts` — 4 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Exports an axios instance with request method | Config module exports a valid axios instance with `get` and `post` |
| 2 | Request interceptor adds Authorization when admin_token exists | Bearer token is attached to requests when `admin_token` is in localStorage |
| 3 | Request interceptor does not add Authorization when no token | No Authorization header when token is absent |
| 4 | Response interceptor clears localStorage on 401 | Token and related data are removed on authentication failure |

**File:** `frontend/src/config/axios.test.ts`

---

## Backend Tests (27 total)

### 1. `error.utils.test.ts` — 5 tests

| # | Test | Description |
|---|------|-------------|
| 1 | CustomError: creates error with default message and statusCode | Defaults to "Interval Server Error" and 500 |
| 2 | CustomError: creates error with custom message and statusCode | Accepts custom message and HTTP status |
| 3 | CustomError: is instance of Error | Proper inheritance from Error |
| 4 | asyncErrorHandler: calls handler and passes through when no error | Successful handler execution |
| 5 | asyncErrorHandler: catches async errors and passes them to next | Errors are forwarded to the Express error handler |

**File:** `Ziplofy3b/src/utils/error.utils.test.ts`

---

### 2. `error.middleware.test.ts` — 5 tests

| # | Test | Description |
|---|------|-------------|
| 1 | Handles CustomError and returns correct status and JSON | CustomError yields correct HTTP status and body |
| 2 | Handles Mongoose CastError and returns 404 | Invalid ObjectId returns "Resource not found" |
| 3 | Handles Mongoose duplicate key (11000) and returns 400 | Duplicate key constraint returns 400 |
| 4 | Handles Mongoose ValidationError and returns 400 | Validation errors return 400 with joined messages |
| 5 | Handles unknown error and returns 500 | Unhandled errors return 500 |

**File:** `Ziplofy3b/src/middlewares/error.middleware.test.ts`

---

### 3. `auth.middleware.test.ts` — 9 tests

| # | Test | Description |
|---|------|-------------|
| 1 | protect: returns 401 when no token provided | Unauthenticated requests are rejected |
| 2 | protect: returns 401 when Authorization header has no Bearer prefix | Malformed auth header is rejected |
| 3 | protect: sets req.user when SUPER_ADMIN_TOKEN is provided | Super admin token populates req.user |
| 4 | protect: sets req.user when valid JWT and user found in database | JWT + DB user populates req.user |
| 5 | protect: returns 401 when JWT verification fails | Invalid JWT is rejected |
| 6 | authorize: returns 401 when no user in request | Missing user causes 401 |
| 7 | authorize: allows super admin regardless of required roles | Super admin bypasses role check |
| 8 | authorize: returns 403 when user role is not in allowed roles | Insufficient role returns 403 |
| 9 | authorize: allows when user role is in allowed roles | Allowed role passes authorization |

**File:** `Ziplofy3b/src/middlewares/auth.middleware.test.ts`

---

### 4. `auth.controller.test.ts` — 5 tests

| # | Test | Description |
|---|------|-------------|
| 1 | adminLogin: calls next with 400 when email is missing | Missing email triggers validation error |
| 2 | adminLogin: calls next with 400 when password is missing | Missing password triggers validation error |
| 3 | adminLogin: calls next with 401 when user not found | Unknown email returns invalid credentials |
| 4 | adminLogin: calls next with 401 when password does not match | Wrong password returns invalid credentials |
| 5 | adminLogin: returns 200 with token and user on valid credentials | Success returns token and user object |

**File:** `Ziplofy3b/src/controllers/auth.controller.test.ts`

---

### 5. `auth.route.test.ts` — 3 tests

| # | Test | Description |
|---|------|-------------|
| 1 | POST /api/auth/admin/login: returns 400 when email and password are missing | Empty body returns 400 |
| 2 | POST /api/auth/admin/login: returns 401 when user not found | Invalid credentials return 401 |
| 3 | POST /api/auth/admin/login: returns 200 with token on valid credentials | Valid login returns 200 and token |

**File:** `Ziplofy3b/src/routes/auth.route.test.ts`

---

## How to Run Tests

### Frontend

```bash
cd frontend
npm run test:run      # Single run
npm run test          # Watch mode
npm run test:coverage # With coverage report
```

### Backend

```bash
cd Ziplofy3b
npm run test:run      # Single run
npm test              # Watch mode
npm run test:coverage # With coverage report
```

### Both

```bash
cd frontend && npm run test:run && cd ../Ziplofy3b && npm run test:run
```

---

## Last Updated

Run the tests locally to confirm the latest results. This document reflects the test suite as implemented for the admin panel (frontend and Ziplofy3b).
