# Discount Logic Deep-Dive Report

Generated on: 2026-02-18  
Workspace: `C:\Work\merged-ziplofy-`  
Scope covered:

- Backend discount models + logic in `Ziplofy3b`
- Admin discount creation/edit flows in `Ziplofy`
- Storefront discount fetch/apply/display flow in `render-store`

---

## 1) Executive Overview

Your platform currently supports **4 discount families** end-to-end:

1. **Free Shipping**
2. **Amount Off Order**
3. **Amount Off Products**
4. **Buy X Get Y**

High-level architecture:

- **Admin app (`Ziplofy`)** creates and updates discounts.
- **Backend (`Ziplofy3b`)** stores core discount docs + supporting targeting docs, exposes admin CRUD and storefront validation/check endpoints.
- **Storefront (`render-store`)** fetches eligible discounts, applies automatic logic, computes totals client-side, and sends selected discount IDs at order creation.
- **Usage tracking** is persisted when order is placed (`storefront/order.controller.ts`), one usage collection per discount type.

---

## 2) Backend (`Ziplofy3b`) — Core Discount Data Model

All primary discount models live under:

- `Ziplofy3b/src/models/discount/`

### 2.1 Core discount documents (4 models)

### A) Amount Off Order

File:

- `Ziplofy3b/src/models/discount/amount-off-order-discount-model/amount-off-order-discount.model.ts`

Key fields:

- `method`: `discount-code | automatic`
- `discountCode`, `title`
- `valueType`: `percentage | fixed-amount`
- `percentage`, `fixedAmount`
- `eligibility` (all / segment / specific customers)
- minimum requirements: `minimumPurchase`, `minimumAmount`, `minimumQuantity`
- combinations flags: `productDiscounts`, `orderDiscounts`, `shippingDiscounts`
- limits: `limitTotalUses`, `totalUsesLimit`, `limitOneUsePerCustomer`
- schedule/status: `startDate/startTime`, optional end date/time, `status`

Validation:

- `pre('validate')` enforces conditional requirements.

### B) Amount Off Products

File:

- `Ziplofy3b/src/models/discount/amount-off-product-discount-model/amount-off-products-discount.model.ts`

Key fields:

- Same method/value/minimum/eligibility/limits/date structure as above
- `appliesTo`: `specific-products | specific-collections`
- `oncePerOrder` for fixed-amount behavior

Validation:

- `pre('validate')` conditional checks.

### C) Free Shipping

File:

- `Ziplofy3b/src/models/discount/free-shipping-discount-model/free-shipping-discount.model.ts`

Key fields:

- `method`, `discountCode`, `title`
- `countrySelection`: `all-countries | selected-countries`
- `excludeShippingRates`, `shippingRateLimit`
- eligibility, minimum requirement, limits, combinations, status, schedule

Validation:

- `pre('validate')` conditional checks.

### D) Buy X Get Y

File:

- `Ziplofy3b/src/models/discount/buy-x-get-y-discount-model/buy-x-get-y-discount.model.ts`

Key fields:

- `method`, `discountCode`, `title`
- Buys rule: `customerBuys` (`minimum-quantity | minimum-amount`), and `quantity | amount`
- Buys target: `anyItemsFrom`
- Gets rule: `customerGetsQuantity`, `customerGetsAnyItemsFrom`
- Discount value: `discountedValue` (`free | amount | percentage`), and `discountedAmount | discountedPercentage`
- per-order cap: `setMaxUsersPerOrder`, `maxUsersPerOrder`
- eligibility, limits, combinations, schedule/status

Validation:

- `pre('validate')` conditional checks.

---

## 3) Supporting Discount Models (Eligibility/Targeting/Usage)

### 3.1 Usage models (one per discount family)

These are the source of “how many times used”:

- `Ziplofy3b/src/models/discount/amount-off-order-discount-model/amount-off-order-discount-usage.model.ts`
- `Ziplofy3b/src/models/discount/amount-off-product-discount-model/amount-off-products-discount-usage.model.ts`
- `Ziplofy3b/src/models/discount/free-shipping-discount-model/free-shipping-discount-usage.model.ts`
- `Ziplofy3b/src/models/discount/buy-x-get-y-discount-model/buy-x-get-y-discount-usage.model.ts`

Common shape:

- `storeId`, `discountId`, `customerId`, optional `orderId`, `usedAt`

### 3.2 Targeting / eligibility entry models

**Amount Off Order**

- `amount-off-order-customer-entry.model.ts`
- `amount-off-order-customer-segment-entry.model.ts`

**Amount Off Products**

- `amount-off-products-entry.model.ts` (links to product/collection targets)
- `amount-off-products-customer-entry.model.ts`
- `amount-off-products-customer-segment-entry.model.ts`

**Free Shipping**

- `free-shipping-customer-entry.model.ts`
- `free-shipping-customer-segment-entry.model.ts`
- `free-shipping-country-entry.model.ts`

**Buy X Get Y**

- `buy-x-get-y-buys-product-entry.model.ts`
- `buy-x-get-y-buys-collection-entry.model.ts`
- `buy-x-get-y-gets-product-entry.model.ts`
- `buy-x-get-y-gets-collection-entry.model.ts`
- `buy-x-get-y-customer-entry.model.ts`
- `buy-x-get-y-customer-segment-entry.model.ts`

Other supporting models used in eligibility matching:

- `CustomerSegment`, `CustomerSegmentEntry`
- `CollectionEntry` (collection/product resolution for discounts)

---

## 4) Backend Routes + Controllers (Discount APIs)

Route mounting reference:

- `Ziplofy3b/src/index.ts`

Mounted storefront discount routers:

- `/api/storefront/discounts/amount-off-order`
- `/api/storefront/discounts/amount-off-product`
- `/api/storefront/discounts/free-shipping`
- `/api/storefront/discounts/buy-x-get-y`

### 4.1 Admin CRUD routes/controllers

**Amount Off Order**

- Route: `Ziplofy3b/src/routes/amount-off-order-discount.route.ts`
- Controller: `Ziplofy3b/src/controllers/amount-off-order-discount.controller.ts`

**Amount Off Products**

- Route: `Ziplofy3b/src/routes/amount-off-products-discount.route.ts`
- Controller: `Ziplofy3b/src/controllers/amount-off-products-discount.controller.ts`

**Free Shipping**

- Route: `Ziplofy3b/src/routes/free-shipping-discount.route.ts`
- Controller: `Ziplofy3b/src/controllers/free-shipping-discount.controller.ts`

**Buy X Get Y**

- Route: `Ziplofy3b/src/routes/buy-x-get-y-discount.route.ts`
- Controller: `Ziplofy3b/src/controllers/buy-x-get-y-discount.controller.ts`

Admin reporting endpoints for orders-by-discount are present in each family controller (`getOrdersBy...Discount`).

### 4.2 Storefront validation/check endpoints

**Amount Off Order**

- `checkEligibleAmountOffOrderDiscounts`
- `validateAmountOffOrderDiscountCode`
- File: `Ziplofy3b/src/controllers/storefront/amount-off-order.controller.ts`

**Amount Off Product**

- `checkEligibleAmountOffProductDiscounts`
- `validateAmountOffProductDiscountCode`
- File: `Ziplofy3b/src/controllers/storefront/amount-off-product.controller.ts`

**Free Shipping**

- `checkEligibleFreeShippingDiscounts`
- `validateFreeShippingDiscountCode`
- File: `Ziplofy3b/src/controllers/storefront/free-shipping.controller.ts`

**Buy X Get Y**

- `checkEligibleBuyXGetYDiscounts`
- `validateBuyXGetYDiscountCode`
- File: `Ziplofy3b/src/controllers/storefront/buy-x-get-y.controller.ts`

### 4.3 Product-offer discovery API

Routes:

- `Ziplofy3b/src/routes/product-offers.route.ts`
Controller:
- `Ziplofy3b/src/controllers/product-offers.controller.ts`

Functions:

- `getFreeShippingOffersForProduct`
- `getAmountOffOrderOffersForProduct`
- `getAmountOffProductsOffersForProduct`
- `getBuyXGetYOffersForProduct`

---

## 5) Admin App (`Ziplofy`) — Discount Creation/Edit Forms

All 4 forms exist and are mapped properly.

### 5.1 Form pages

- `Ziplofy/src/pages/discounts/AmountOffProductsPage.tsx`
- `Ziplofy/src/pages/discounts/AmountOffOrderPage.tsx`
- `Ziplofy/src/pages/discounts/BuyXGetYPage.tsx`
- `Ziplofy/src/pages/discounts/FreeShippingPage.tsx`

Routes are declared in:

- `Ziplofy/src/App.tsx`

Edit behavior:

- Uses query param `?edit=<discountId>` and loads existing discount data via context fetch methods.

### 5.2 Contexts called by these forms

- `Ziplofy/src/contexts/amount-off-products-discount.context.tsx`
- `Ziplofy/src/contexts/amount-off-order-discount.context.tsx`
- `Ziplofy/src/contexts/buy-x-get-y-discount.context.tsx`
- `Ziplofy/src/contexts/free-shipping-discount.context.tsx`

Also shared:

- `useStore` (`activeStoreId`)
- `useCustomerSegments`
- `useCustomers`
- selectors/multi-select components for targets.

### 5.3 Admin payload and backend mapping

Forms submit payloads that align to backend structures (including target IDs and eligibility selections), then backend controllers persist:

- Main discount doc
- Linked targeting/eligibility docs

Noted risk:

- Amount-off-order fixed amount conversion logic in frontend appears to use scaling heuristics (`*100` on submit and partial reverse logic), which may cause value mismatch depending on backend expectations.

---

## 6) Render Store (`render-store`) — How Discounts Are Fetched and Applied

### 6.1 Discount contexts in storefront

**Checkout contexts**

- `render-store/src/contexts/storefront-free-shipping.context.tsx`
- `render-store/src/contexts/amount-off-order.context.tsx`
- `render-store/src/contexts/amount-off-product.context.tsx`
- `render-store/src/contexts/buy-x-get-y.context.tsx`

**Product offers context**

- `render-store/src/contexts/product-offers.context.tsx`

Provider wiring is in:

- `render-store/src/App.tsx`

### 6.2 Where fetching happens

### A) Cart checkout flow (main)

Main file:

- `render-store/src/components/CartDrawer.tsx`

When checkout opens and cart/address state changes, it triggers all `check` APIs via the contexts:

- Free shipping check
- Amount off order check
- Amount off product check
- Buy X Get Y check

Also manages:

- automatic discount application
- BXGY gets-item selection modal
- final total calculation
- order submit payload with selected discount IDs

### B) Product page offer visibility

Main file:

- `render-store/src/pages/StorefrontProductDetailPage.tsx`

On product/user change, it fetches product-level offers from `/api/product-offers/...` endpoints for all 4 discount types and displays them in “Available offers”.

### C) Buy Now quick checkout (product page)

Same file:

- `render-store/src/pages/StorefrontProductDetailPage.tsx`

Applies automatic discounts client-side (with compatibility checks) and sends selected discount IDs in order create payload.

---

## 7) Discount Combination / Compatibility Behavior

### 7.1 Current strategy in cart checkout (`CartDrawer`)

Observed behavior:

- Build best candidate discount per type
- Check compatibility using combinations metadata
- Evaluate subsets of candidates
- Select subset giving maximum savings
- Apply winning set and remove incompatible ones

This is the most advanced compatibility resolution currently present in storefront logic.

### 7.2 Product Buy Now flow vs cart flow

Product quick checkout uses a simpler approach:

- choose best product + order discount pair with compatibility check
- then attempt shipping discount compatibility

So cart checkout and product quick-checkout may not always use identical optimization strategy.

---

## 8) Usage Tracking: “How many times discounts have been used”

## 8.1 Where usage is recorded (write path)

Main order creation point:

- `Ziplofy3b/src/controllers/storefront/order.controller.ts`
- Function: `createOrder`

Usage creation calls found:

- `AmountOffProductsDiscountUsage.create(...)`
- `AmountOffOrderDiscountUsage.create(...)`
- `BuyXGetYDiscountUsage.create(...)`
- `FreeShippingDiscountUsage.create(...)`

Each is created when respective discount ID is present and passes guard checks (limits, one-per-customer where applicable).

## 8.2 Where usage is checked (read path)

Storefront discount controllers call usage collections to enforce:

- total use limits
- one use per customer

Typical checks:

- `countDocuments({ discountId })` for total usage
- `findOne({ discountId, customerId })` for per-customer lock

## 8.3 “Used how many times” — practical sources

Per discount current usage count can be derived directly from usage collections:

- Count all docs for `discountId`

Per customer usage count:

- Count/filter by `discountId + customerId`

Orders tied to a discount:

- Available via admin controller endpoints (`getOrdersBy...Discount`) and/or usage collection join logic.

> Important: This report documents the tracking architecture and code paths.  
> Exact live numeric usage counts require querying your running database.

---

## 9) End-to-End Flow Summary (Current State)

1. Admin creates discount in `Ziplofy` form.
2. Form hits discount-specific context -> backend CRUD endpoint.
3. Backend persists discount + linked eligibility/target entries.
4. Storefront opens checkout (or product page) and calls discount `check`/offer endpoints.
5. Storefront applies auto-discount logic and computes totals.
6. On place order, selected discount IDs are submitted.
7. Backend order creation writes usage entries in type-specific usage models.
8. Future checks/validations read usage collections to enforce limits.

---

## 10) Current Strengths and Gaps

### Strengths

- Clear split between discount types and dedicated controllers.
- Dedicated usage tracking per discount family.
- Admin + storefront APIs are largely consistent by type.
- Render-store has explicit discount contexts and modular hooks.

### Gaps / risks

- No single central backend stacking engine; compatibility is mostly client-driven.
- Potential race conditions around usage limits under concurrent checkout (check then create pattern).
- Some frontend admin validation paths are permissive; backend model checks carry most enforcement.
- Potential currency unit mismatch risk in amount-off-order fixed amount admin flow.
- Product quick-checkout discount optimization is simpler than cart checkout logic (possible behavior drift).

---

## 11) Fast File Index (Most Important Files)

### Backend (`Ziplofy3b`)

- `src/index.ts`
- `src/controllers/storefront/order.controller.ts`
- `src/controllers/storefront/free-shipping.controller.ts`
- `src/controllers/storefront/amount-off-order.controller.ts`
- `src/controllers/storefront/amount-off-product.controller.ts`
- `src/controllers/storefront/buy-x-get-y.controller.ts`
- `src/controllers/product-offers.controller.ts`
- `src/models/discount/`**

### Admin (`Ziplofy`)

- `src/pages/discounts/AmountOffProductsPage.tsx`
- `src/pages/discounts/AmountOffOrderPage.tsx`
- `src/pages/discounts/BuyXGetYPage.tsx`
- `src/pages/discounts/FreeShippingPage.tsx`
- `src/contexts/*discount*.context.tsx`

### Storefront (`render-store`)

- `src/components/CartDrawer.tsx`
- `src/pages/StorefrontProductDetailPage.tsx`
- `src/contexts/storefront-free-shipping.context.tsx`
- `src/contexts/amount-off-order.context.tsx`
- `src/contexts/amount-off-product.context.tsx`
- `src/contexts/buy-x-get-y.context.tsx`
- `src/contexts/product-offers.context.tsx`

---

## 12) Optional Next Step (if you want)

If you want, next I can generate:

1. A **sequence diagram** markdown for cart checkout discount flow.
2. A **DB query cheatsheet** to fetch exact usage counts per discount (top used discounts, per-customer usage, per-day usage).
3. A **consistency audit** between cart checkout and product quick-checkout calculation rules.

