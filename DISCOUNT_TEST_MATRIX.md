# Discount Test Matrix

Generated on: 2026-02-18  
Workspace: `C:\Work\merged-ziplofy-`

Purpose:

- Provide a practical, execution-ready QA matrix for the full discount system.
- Validate both functional correctness and consistency between:
  - Cart checkout (`CartDrawer`)
  - Product Buy-Now quick checkout (`StorefrontProductDetailPage`)

---

## 1) How To Use This Matrix

For each scenario:

1. Seed/create required discounts in admin (`Ziplofy`).
2. Prepare cart/user/address state exactly as precondition.
3. Execute in **both flows** where specified:
  - Flow A: Add to cart -> open cart drawer -> checkout
  - Flow B: Open PDP -> Buy Now quick checkout
4. Record:
  - Applied discounts
  - Displayed savings
  - Final payable
  - Order payload discount IDs (network tab)
  - Created usage rows (Mongo)
5. Compare actual vs expected.

---

## 2) Common Test Data Setup

Use stable fixtures:

- Store: `S1`
- Customer:
  - `C_AUTH` (logged-in customer)
  - `C_GUEST` (not logged in)
- Products:
  - `P1` in collection `COL_A`, price 1000
  - `P2` in collection `COL_A`, price 2000
  - `P3` in collection `COL_B`, price 3000
- Shipping countries:
  - India (`IN`)
  - US (`US`)
- Addresses:
  - `ADDR_IN` country IN
  - `ADDR_US` country US

Suggested cart fixtures:

- `CART_A`: P1 x1 (subtotal 1000)
- `CART_B`: P1 x2 + P2 x1 (subtotal 4000)
- `CART_C`: P3 x2 (subtotal 6000)

---

## 3) Base Functional Matrix (Per Discount Type)


| ID  | Type                                   | Preconditions                                                            | Steps                        | Expected                                              |
| --- | -------------------------------------- | ------------------------------------------------------------------------ | ---------------------------- | ----------------------------------------------------- |
| F01 | Free Shipping automatic                | Active automatic FS, eligible for all, no min, combinations all true     | CART_A + ADDR_IN -> checkout | FS auto-applied, shipping waived, FS discount ID sent |
| F02 | Free Shipping code                     | Active code FS (`FREESHIP`), eligible, code UI path enabled if available | Apply code in checkout       | FS code accepted, automatic FS cleared for FS type    |
| F03 | FS country restriction                 | FS set to selected countries = IN only                                   | Use ADDR_US                  | FS not eligible                                       |
| F04 | FS min amount                          | FS min amount = 5000                                                     | CART_A then CART_C           | CART_A not eligible, CART_C eligible                  |
| O01 | Amount Off Order % automatic           | 10% order discount active, min 1000                                      | CART_B checkout              | Discount amount = 10% of eligible base, AOO ID sent   |
| O02 | Amount Off Order fixed                 | Fixed 500 active                                                         | CART_A checkout              | Discount = min(500, base)                             |
| O03 | AOO code invalid                       | No matching active code                                                  | Enter invalid code           | Error message, no code discount applied               |
| P01 | Amount Off Product specific product    | 20% on P1 only                                                           | CART_B checkout              | Discount only on P1 portion                           |
| P02 | Amount Off Product specific collection | 10% on COL_A                                                             | CART_B checkout              | Discount on P1+P2 lines only                          |
| P03 | Amount Off Product oncePerOrder        | fixed 300 oncePerOrder true                                              | eligible cart with qty>1     | Fixed amount applies once (not per qty)               |
| B01 | BXGY basic                             | Buy 2 from COL_A get 1 free from COL_A                                   | CART_B checkout              | BXGY appears eligible; gets item applied/selected     |
| B02 | BXGY percentage gets                   | Buy threshold met, gets discount 50%                                     | eligible cart                | gets item discounted as configured                    |
| B03 | BXGY not qualified                     | buy condition not met                                                    | CART_A                       | BXGY not eligible                                     |


---

## 4) Combination / Compatibility Matrix

Objective:

- Validate `combinations` flags are respected in cart flow.

### 4.1 Pairwise compatibility


| ID  | Pair               | Flag Setup                          | Expected                        |
| --- | ------------------ | ----------------------------------- | ------------------------------- |
| C01 | Product + Order    | both allow each other               | both apply                      |
| C02 | Product + Order    | product disallows order             | only one applies (best savings) |
| C03 | Product + Order    | order disallows product             | only one applies (best savings) |
| C04 | Order + Shipping   | both allow                          | both apply                      |
| C05 | Order + Shipping   | shipping disallows order            | shipping excluded or order-only |
| C06 | Product + Shipping | both allow                          | both apply                      |
| C07 | BXGY + Product     | one side disallows productDiscounts | only compatible one remains     |
| C08 | BXGY + Order       | one side disallows orderDiscounts   | only compatible one remains     |


### 4.2 Triple and all-four


| ID  | Setup                                           | Expected                        |
| --- | ----------------------------------------------- | ------------------------------- |
| C09 | Order + Product + Shipping all mutually allowed | all three apply                 |
| C10 | BXGY + Product + Order mixed flags              | only valid subset chosen        |
| C11 | All four enabled, one conflict introduced       | max-savings valid subset chosen |


---

## 5) Cart vs Buy-Now Parity Matrix (Critical)

Use same customer, same product, same qty, same address.


| ID  | Scenario                        | Run In        | Expected                                                           |
| --- | ------------------------------- | ------------- | ------------------------------------------------------------------ |
| Q01 | Only order discount available   | Cart + BuyNow | same applied discount ID and same final total                      |
| Q02 | Only product discount available | Cart + BuyNow | same applied discount ID and same final total                      |
| Q03 | Product + Order both compatible | Cart + BuyNow | ideally same outcome; if mismatch, log as drift                    |
| Q04 | Product + Order incompatible    | Cart + BuyNow | both should choose better single discount                          |
| Q05 | Free shipping + order discount  | Cart + BuyNow | verify shipping treatment parity (likely drift today)              |
| Q06 | BXGY eligible with gets choice  | Cart + BuyNow | validate behavior; log differences if BuyNow lacks equivalent path |


Acceptance policy:

- Q01–Q04 should match.
- Q05/Q06 may expose known current design drift; mark as “expected drift” until architecture is unified.

---

## 6) Usage Limits Matrix


| ID  | Rule                   | Preconditions                               | Steps                                                         | Expected                                                    |
| --- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| U01 | limitOneUsePerCustomer | discount with `limitOneUsePerCustomer=true` | Place order twice as same customer                            | first success, second rejected/not eligible                 |
| U02 | limitTotalUses         | totalUsesLimit=1                            | two different customers place order concurrently/sequentially | second should fail after first uses limit                   |
| U03 | usage row creation     | any applied discount                        | place order                                                   | usage document created with discountId, customerId, orderId |
| U04 | no discount applied    | no eligible discounts                       | place order                                                   | no usage rows created                                       |
| U05 | all types applied      | compatible setup for all                    | place order                                                   | usage rows for each applied type created                    |


Concurrency note:

- Run U02 with near-simultaneous checkouts to detect race-condition behavior.

---

## 7) Eligibility Matrix


| ID  | Eligibility Type  | Setup                 | Expected                                                         |
| --- | ----------------- | --------------------- | ---------------------------------------------------------------- |
| E01 | all customers     | default all           | eligible for both logged-in users                                |
| E02 | specific customer | include only C_AUTH   | C_AUTH eligible, others not                                      |
| E03 | customer segment  | include segment SEG_A | only customers in SEG_A eligible                                 |
| E04 | guest checkout    | customerId absent     | endpoint behavior matches type rules (verify each discount type) |


---

## 8) Date/Status Matrix


| ID  | Condition         | Setup                 | Expected                      |
| --- | ----------------- | --------------------- | ----------------------------- |
| D01 | inactive status   | status=inactive       | never eligible                |
| D02 | before start date | startDate in future   | not eligible                  |
| D03 | after end date    | endDate in past       | not eligible                  |
| D04 | valid window      | current date in range | eligible if other checks pass |


---

## 9) Error/Resilience Matrix


| ID  | Failure Mode                         | Test                                           | Expected                                                |
| --- | ------------------------------------ | ---------------------------------------------- | ------------------------------------------------------- |
| R01 | discount check API fails             | force 500 on one type                          | checkout still usable, other discounts still processed  |
| R02 | invalid discount ID sent on order    | tamper payload                                 | backend should reject or ignore invalid discount safely |
| R03 | address missing for shipping checks  | remove selected address                        | free shipping handling degrades gracefully              |
| R04 | empty cart checkout                  | open checkout with no cart lines               | order blocked                                           |
| R05 | stale discount (deleted after fetch) | fetch eligible then delete discount before pay | order creation handles safely, no crash                 |


---

## 10) DB Verification Checklist (Per Scenario)

After placing an order with expected discount `D`:

- Order contains expected discount ID field
- Exactly one usage row created in corresponding usage collection
- `customerId`, `storeId`, `orderId` correctly populated
- For one-use rules, second attempt does not create second usage row

Quick verification query template:

```javascript
db.amountofforderdiscountusages.find({ discountId: ObjectId("<discountId>") })
  .sort({ usedAt: -1 })
  .limit(5)
```

---

## 11) Priority Execution Plan (If Time Is Limited)

Run in this order:

1. **P0 Core**: F01, O01, P01, B01
2. **P0 Consistency**: Q01, Q03, Q05
3. **P0 Limits**: U01, U02, U03
4. **P1 Compatibility**: C01, C02, C04, C07, C11
5. **P1 Eligibility/Date**: E02, E03, D02, D03
6. **P2 Resilience**: R01, R05

---

## 12) Pass/Fail Log Template

Copy this block per test:

```md
### [TEST_ID] - <name>
- Build/Commit: <hash or date>
- Flow: Cart / BuyNow / Both
- Preconditions:
  - ...
- Steps:
  1. ...
  2. ...
- Expected:
  - ...
- Actual:
  - ...
- Result: PASS / FAIL
- Notes:
  - ...
- Network evidence:
  - check endpoint response:
  - createOrder payload:
- DB evidence:
  - usage count before:
  - usage count after:
```

---

## 13) Known Current Expected Drifts (Do Not Auto-Mark As Defect Without Review)

1. Cart checkout and BuyNow quick-checkout use different discount optimization logic.
2. Shipping treatment differs between flows (cart has explicit shipping cost model, quick checkout simpler total formula).
3. BXGY selection complexity is richer in cart flow.

These should be tracked as architectural parity items unless intentionally accepted.