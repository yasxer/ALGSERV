# Bug Fixes TODO

> Updated after full project audit — 2026-07-01.
> The app has grown past the original brief: it now has Supabase auth (`/auth`),
> an admin dashboard (`/admin`) protected by `proxy.ts`, Chargily payment
> (`/api/payment/*`), and two "legacy" Telegram-only routes (`/api/moqawil-dati`,
> `/api/professional`). Below reflects the code as it stands today.

---

## 🗺️ How the project works right now (map)

- **Landing / services** → `app/page.tsx`, service cards.
- **CV** (`/order/cv`, 500 DA) → fills form client-side → `POST /api/payment/create`
  → Chargily → returns to `?paid=1` → prints via `window.print()`.
- **Facture** (`/order/facture`, 250 DA) → same pattern, client-side print.
- **Moqawil Dati** (`/order/business/moqawil-dati`, 2500 DA) → pay first
  → after `?paid=1`, `POST /api/moqawil-dati` (FormData) → **Telegram only**.
- **Professional** (`/order/professional/{web-dev,app-dev}`) → `POST /api/professional`
  → **Telegram only, no payment, no DB order**.
- **Payment**: `app/api/payment/create/route.ts` inserts an `orders` row (unpaid) →
  Chargily checkout; `webhook/route.ts` flips `payment_status='paid'` by `orderId`.
- **Admin**: `app/admin/page.tsx` reads/writes via RPCs (`admin_get_orders`,
  `admin_update_order_status`, `admin_update_order_payment`, `get_my_role`).
- **Auth gate**: `proxy.ts` (Next 16 renamed `middleware` → `proxy`; this is correct).

---

## 🔴 Critical

- [x] **Payment is fully bypassable — `?paid=1` unlocks the document for free** ✅ FIXED
  - Files: `app/api/payment/verify/route.ts` (new), `app/api/payment/create/route.ts`,
    `app/order/cv/page.tsx`, `app/order/facture/page.tsx`, `app/order/business/moqawil-dati/page.tsx`
  - Fix: the guessable `?paid=1` gate is gone. Chargily now redirects to
    `?order=<orderId>`, and every page calls **`POST /api/payment/verify`** which
    confirms the payment server-side — first against the DB, then straight from
    Chargily (`getCheckout(...).status === 'paid'`, independent of webhook timing).
    The document/submit is unlocked only when the server returns `{ paid: true }`.
    Pages show a "Vérification du paiement…" overlay and a red banner on failure.

- [x] **CV/Facture paid orders send NO notification** ✅ FIXED
  - Files: `lib/telegram.ts` (new), `lib/payments.ts` (new),
    `app/api/payment/webhook/route.ts`, `app/api/payment/verify/route.ts`
  - Fix: `markOrderPaidAndNotify()` does a **race-safe, idempotent** conditional flip
    (`payment_status != 'paid'`) and sends a Telegram notification for the order.
    Both the webhook AND the verify route call it; whichever wins the flip is the only
    one that notifies, so there is no double-ping. Works for every service (CV,
    Facture, Moqawil). _Note: persisting full CV/Facture content server-side is a
    separate design decision — still deliberately not stored (privacy)._

- [x] **`supabase-schema.sql` out of sync — admin RPCs & payment column missing** ✅ FIXED
  - File: `supabase-schema.sql`
  - Fix: added `orders.chargily_checkout_id`, and the RPCs the app depends on —
    `get_my_role`, `is_admin`, `admin_get_orders`, `admin_update_order_status`,
    `admin_update_order_payment` — all `security definer` with an internal admin check,
    plus `grant execute ... to authenticated`.
  - ⚠️ **ACTION REQUIRED**: run the updated `supabase-schema.sql` (or at least sections
    4 & 5) in the Supabase SQL editor on your live project — the code needs these to work.

- [x] **Admin service key mismatch — Moqawil orders/revenue invisible** ✅ FIXED
  - File: `app/admin/page.tsx`
  - Fix: `SERVICE_LABELS`/`SERVICE_COLORS` and the "Par service" list now key on the
    real slug `moqawil-dati` (was `moqawil`), so paid Moqawil orders display and their
    revenue is counted.

- [ ] **Moqawil Dati: paid but files can still be lost** 🔶 PARTIALLY ADDRESSED
  - Files: `app/order/business/moqawil-dati/page.tsx`, `app/api/moqawil-dati/route.ts`
  - Done: the paid order is now recorded and the owner is notified on payment (above),
    so a payment is never fully invisible anymore.
  - Still open: the 3 uploaded files are sent **only** to Telegram via `after()`
    (fire-and-forget) after a manual re-upload. If the user closes the tab after paying,
    or the Telegram send fails, the files are still lost.
  - Next: upload files to Supabase Storage linked to the `orders` row; warn on
    `beforeunload` when paid-but-not-submitted.

### ✅ Done (previous round)
- [x] Facture / Moqawil Dati — form data lost on refresh (`sessionStorage` draft).
- [x] Payment — stale `localStorage` cleared on failure.
- [x] Webhook — order created before redirect, marked paid via `orderId` metadata.
- [x] Webhook — guards against missing `CHARGILY_WEBHOOK_SECRET`.
- [x] `locale` whitelisted before Chargily (`create/route.ts:26`).

---

## 🟠 High Priority

- [ ] **Legacy submit routes have no validation, rate-limit, or auth** 🆕
  - Files: `app/api/moqawil-dati/route.ts:48`, `app/api/professional/route.ts:15`
  - Problem: both accept any payload and immediately relay to Telegram. Anyone can
    POST directly and spam the owner's Telegram (brief §7.4 requires rate-limiting the
    submit endpoint). No field validation/sanitization either.
  - Fix: add basic validation + IP-based rate limiting; consider a shared token check.

- [ ] **Language flash on refresh (useLang)**
  - File: `lib/useLang.ts:9`
  - Still present. Initialize `useState` from `localStorage` via a lazy initializer
    (guarded for SSR) instead of setting it in `useEffect`, to kill the first-render flash.

- [ ] **Facture — language always defaults to `fr`**
  - File: `app/order/facture/page.tsx:118-119`
  - Still present. `lang`/`docLang` use `useState('fr')` instead of `useLang()`, so the
    facture page ignores the saved language and never persists a change.

- [ ] **Moqawil Dati — file uploads reset on refresh / redirect**
  - File: `app/order/business/moqawil-dati/page.tsx:234-236`
  - Files can't survive the Chargily redirect. At minimum warn on `beforeunload` when
    files are selected but not yet submitted. (See also the Critical "files lost" item.)

---

## 🟡 Medium

- [ ] **Memory leak — blob URLs never revoked in FileUploadBox**
  - File: `app/order/business/moqawil-dati/page.tsx:154`
  - `URL.createObjectURL(file)` runs on **every render** with no `URL.revokeObjectURL`.
  - Fix: compute the preview in a `useEffect` keyed on `file` with a cleanup that revokes.

- [ ] **Admin — no rollback when RPC fails**
  - File: `app/admin/page.tsx:250-261` (`updateStatus`, `togglePayment`)
  - The `await supabase.rpc(...)` result is never checked; the optimistic UI update
    stays even if the DB write failed. Wrap in try/catch and revert on error.

- [ ] **`numberToWordsFr` ignores centimes** 🆕
  - File: `app/order/facture/page.tsx:62`
  - Only `Math.floor(n)` is spelled out; a total like `1500,50 DA` reads as
    "mille cinq cents dinars", silently dropping the 50 centimes on the invoice.
  - Fix: append the decimal part ("... et cinquante centimes") or round explicitly.

- [ ] **API payment errors not specific enough**
  - File: `app/api/payment/create/route.ts:68`
  - Chargily errors are swallowed into a generic "Payment creation failed". Catch
    Chargily-specific errors and return actionable messages to the frontend.

- [ ] **CV back button / template selection**
  - File: `app/order/cv/page.tsx:71-95`
  - Largely addressed now: `sessionStorage` (`cv_session`) persists `template`,
    `docLang`, `accentColor`, `d`, and `popstate` restores `step`. Re-verify the
    back-button UX end-to-end and then close this item.

---

## 🟢 Low / polish

- [ ] **Dead ternary in facture quantity cell** 🆕
  - File: `app/order/facture/page.tsx:602` — `... % 1 === 0 ? item.quantity : item.quantity`
    both branches are identical. Remove or implement the intended formatting.

- [ ] **`admin/page.tsx` auth `useEffect` missing deps** 🆕
  - File: `app/admin/page.tsx:225-235` — deps array is `[]` while using `supabase`/`router`;
    harmless today but will trip `react-hooks/exhaustive-deps`. The `proxy.ts` gate already
    protects `/admin`, so the client-side check is somewhat redundant.

- [ ] **Professional services bypass the payment model** 🆕
  - Files: `app/order/professional/*`, `app/api/professional/route.ts`
  - These are free "quote request" flows (Telegram only) while everything else is
    pay-upfront. Confirm this is intentional; if so, keep them out of revenue stats.

### ✅ Done (previous round)
- [x] `locale` validated before sending to Chargily.
- [x] Admin session survives refresh — Supabase-SSR persists the session in cookies,
      and `proxy.ts` re-checks the role server-side, so the old "session lost on refresh"
      item no longer reproduces.
