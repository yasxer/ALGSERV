# PROJECT BRIEF — Digital Bureau (MVP)

> A prompt for Claude Code. Read this whole file before writing any code.
> Build incrementally, commit after each phase, and ask me before installing anything not listed here.

---

## 1. What we are building

A **digital bureau** web app for the Algerian market. People in Algeria normally go to a physical "bureau" to get documents prepared (CV, invoice/facture, visa application, auto-entrepreneur card, etc.). This product moves that workflow online: the customer fills a form, pays online, and receives a finished, professional document — without leaving home or standing in a queue.

**This MVP ships only two services:**
1. **CV** — customer fills a structured form, we generate a clean professional CV (PDF).
2. **Facture** (invoice) — customer fills invoice details, we generate a legally-formatted Algerian invoice (PDF).

All other services (visa, auto-entrepreneur, etc.) appear in the UI as **"Coming soon"** cards — visible but disabled, to signal the roadmap and build anticipation. Do not build their forms yet.

### Core principles
- **No customer login / no auth for customers.** The customer just fills a form and pays. Simplicity is the point.
- **The customer can only WRITE (submit a request). They can never READ other requests.** This is a hard security requirement (see Security section).
- The owner (me) reads all requests from a simple protected admin dashboard.
- Payment is **upfront, online, before** the request is recorded as paid — protects against no-shows and gives immediate cashflow.
- The whole thing must look **trustworthy and premium**, because Algerian customers are cautious about paying an unknown online service. Design = trust, not flashiness.

---

## 2. Tech stack (do not deviate without asking)

- **Framework:** Next.js (App Router, latest stable). TypeScript.
- **Backend + DB:** Supabase (Postgres). Use the JS client `@supabase/supabase-js`.
- **Styling:** Tailwind CSS. Use the design tokens in section 5.
- **Fonts:** `Plus Jakarta Sans` (Latin) via `next/font/google`. Support Arabic text with a system Arabic fallback.
- **PDF generation:** server-side. Use `@react-pdf/renderer` OR a headless-Chrome approach (`puppeteer-core` + `@sparticuz/chromium`) — pick `@react-pdf/renderer` first for simplicity; flag if it limits the design.
- **Payment:** Chargily Pay (Algerian gateway, supports CIB + Edahabia). Use their official API/SDK. Sandbox/test mode first.
- **Notifications:** Telegram Bot API — ping me on every new paid request.
- **Deploy target:** Vercel.

---

## 3. Architecture overview

```
Customer (browser)
  → fills dynamic form (Next.js)
  → redirected to Chargily checkout (pays CIB/Edahabia)
  → Chargily webhook confirms payment (Next.js API route, server-side)
  → request marked paid in Supabase
  → Telegram bot pings me
  → I open admin dashboard, complete the document, mark "ready"/"delivered"
  → customer gets the PDF (download link / WhatsApp)
```

Two Supabase keys, used in two different places — this separation is the whole security model:
- `anon key` → used in the browser. Can only INSERT requests. Cannot read anything.
- `service_role key` → used ONLY in server-side code (API routes / server components / server actions). Reads everything. **Never prefixed with `NEXT_PUBLIC_`. Never reaches the browser.**

---

## 4. Database schema (Supabase)

Run this SQL in Supabase. Keep it **service-agnostic** so adding the future services (visa, auto-entrepreneur) later needs only a new row in `services` + a new form config + a new PDF template — never a schema change.

```sql
-- Catalog of services (CV, facture now; visa, auto-entrepreneur later)
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'cv', 'facture'
  name text not null,                 -- display name (FR/AR)
  price integer not null,             -- price in DZD
  is_active boolean not null default true,   -- false = "coming soon"
  created_at timestamptz not null default now()
);

-- Every customer request, regardless of service type
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null references public.services(slug),
  client_name text not null,
  client_phone text not null,
  client_email text,
  data jsonb not null default '{}'::jsonb,   -- all form answers, shape varies per service
  status text not null default 'new'
    check (status in ('new','in_progress','ready','delivered')),
  paid boolean not null default false,
  amount integer,                            -- DZD actually charged
  chargily_checkout_id text,                 -- link to payment
  document_url text,                         -- final generated PDF
  created_at timestamptz not null default now()
);

-- Security: lock the table down
alter table public.requests enable row level security;
alter table public.services enable row level security;

-- Anyone (anon) may submit a request — INSERT only
create policy "anon_can_insert_requests"
  on public.requests for insert to anon with check (true);

-- Anyone (anon) may read the services catalog (to show prices on the site)
create policy "anon_can_read_services"
  on public.services for select to anon using (true);

-- NOTE: no SELECT/UPDATE/DELETE policy for anon on `requests`.
-- => browser clients cannot read or modify requests at all.
-- The owner reads/updates via service_role key on the server, which bypasses RLS.

-- Seed the two live services
insert into public.services (slug, name, price, is_active) values
  ('cv', 'CV professionnel', 500, true),
  ('facture', 'Facture', 300, true);
```

> Prices (500 / 300 DZD) are placeholders — I'll confirm. Keep them in the DB, never hardcoded in the frontend.

---

## 5. Design system (this is the heart of the "premium" feel)

The design must read as **clean, calm, trustworthy** — like a bank or insurance site, not a flashy startup. Whitespace and restraint signal quality. Follow these exactly.

### 5.1 Color palette

```
/* Primary — Deep Indigo (text, header, footer, serious surfaces) */
--ink-900: #0F172A;
--ink-800: #1E293B;
--ink-700: #334155;
--ink-600: #475569;
--ink-500: #64748B;

/* Accent — Trust Blue (ONLY for CTAs, links, key actions — keep it rare) */
--blue-600: #2563EB;
--blue-500: #3B82F6;
--blue-100: #DBEAFE;

/* Success — payment done / request ready (use sparingly, semantic only) */
--green-600: #059669;
--green-100: #D1FAE5;

/* Neutrals — backgrounds & borders (this is 60% of the UI) */
--white:     #FFFFFF;
--surface:   #F8FAFC;
--border:    #E2E8F0;
```

### 5.2 The 60-30-10 rule (critical — enforce it)
- **60% neutral**: white + `#F8FAFC` backgrounds. This is most of the page.
- **30% primary**: `#1E293B` / `#0F172A` for text, header, footer.
- **10% accent**: `#2563EB` ONLY on primary buttons, links, and CTAs. If blue appears everywhere it loses its power — keep it scarce so every "Order now" button commands attention.
- Green is **semantic only**: payment success, "ready" status badges. Never decorative.

### 5.3 Typography
- Font: `Plus Jakarta Sans` for Latin; system Arabic fallback for Arabic strings.
- Scale: hero 48px / section heading 32px / card title 20px / body 16px / small 14px.
- Two weights only: 400 (regular) and 600 (semibold). No 700+ — too heavy.
- Generous line-height on body (1.7).
- Sentence case everywhere. Never ALL CAPS, never Title Case.

### 5.4 Spacing & layout
- Whitespace is the luxury signal. Be generous.
- 80–120px vertical gap between page sections.
- Card padding: 24–32px.
- Max content width ~1200px, centered.
- Consistent `border-radius: 12px` on everything (cards, inputs, buttons).
- Borders are thin: `0.5px` / `1px` in `--border`, never heavy.
- Shadows are barely-there (`shadow-sm`); never thick drop shadows.
- Smooth `transition: 0.2s` on interactive elements (hover states on buttons/cards).

### 5.5 RTL / language
- UI primarily in French (the common business language for these services), with Arabic-friendly typography.
- Build layout RTL-aware where Arabic is used. Keep copy short and clear.
- Don't over-engineer i18n for the MVP — French primary is fine, but don't hardcode in a way that blocks adding Arabic later.

---

## 6. Pages & components to build (MVP scope)

### 6.1 Landing page (`/`)
Sections in this trust-building order:
1. **Hero** — one-line promise + primary CTA ("Commander maintenant"). Example promise: *"Vos documents administratifs prêts, depuis chez vous, sans files d'attente."*
2. **How it works** — 3 steps: Remplir → Payer → Recevoir. Simple, reassuring icons.
3. **Services** — cards pulled from the `services` table:
   - Active services (CV, Facture): show price, "Commander" button.
   - Inactive services: render as **"Bientôt disponible"** (coming soon) cards — visibly disabled, muted styling, no button.
4. **Trust section** — placeholder for testimonials, "X documents livrés" counter, and a guarantee line ("Satisfait ou refait"). Use placeholder content I can edit.
5. **Final CTA + Footer** — real contact info (phone, email), short links. Footer in `--ink-900`.

### 6.2 Service request flow (`/order/[slug]`)
- A **dynamic form** driven by a per-service JSON/TS config (see 6.3). One reusable `<DynamicForm>` component renders any service's fields. Adding a future service = adding a config object, not a new page.
- On submit:
  1. INSERT the request into Supabase (`paid: false`) via anon key.
  2. Create a Chargily checkout for the service price.
  3. Redirect the customer to Chargily's hosted payment page.

### 6.3 Form configs
Define forms as config, not hardcoded JSX. Example shape:

```ts
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'date' | 'number' | 'repeater';

interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  fields?: FormField[]; // for 'repeater' (e.g. work experiences)
}

interface ServiceFormConfig {
  slug: string;
  title: string;
  fields: FormField[];
}
```

**CV form fields** (build this config):
- Full name (text, required)
- Phone (tel, required)
- Email (email)
- Job title / target role (text)
- Professional summary (textarea)
- Work experience (repeater: company, role, start date, end date, description)
- Education (repeater: institution, degree, year)
- Skills (textarea or tag input)
- Languages (textarea)
- Photo upload (optional — store in Supabase Storage; flag if this complicates the MVP, can defer)

**Facture form fields** (build this config — Algerian invoice format):
- Issuer company name (text, required)
- Issuer NIF (text)  // Numéro d'Identification Fiscale
- Issuer RC (text)   // Registre de Commerce
- Issuer AI (text)   // Article d'Imposition
- Issuer address (textarea)
- Client name (text, required)
- Client address (textarea)
- Invoice number (text)
- Invoice date (date)
- Line items (repeater: description, quantity, unit price)
- TVA rate (number, default 19) // Algerian VAT
- Auto-compute: subtotal, TVA amount, total TTC — show live in the form and on the PDF.

### 6.4 Payment (Chargily)
- Server-side route to create a checkout from a request + service price.
- Webhook route (server-side) that verifies Chargily's signature, then sets `paid = true` and `chargily_checkout_id` on the request.
- After webhook confirms payment → trigger the Telegram notification.
- Use Chargily **test mode** until I give live keys. Document clearly where keys go in `.env`.

### 6.5 PDF generation
- Server-side only. One template per service.
- **CV template:** clean, modern, single-accent (use `--ink` for text, `--blue-600` sparingly for section rules/name). 1–2 layout options is enough.
- **Facture template:** formal Algerian invoice — issuer block, client block, line-items table, TVA breakdown, total TTC, invoice number + date. Must look official.
- Save the generated PDF to Supabase Storage; write its URL to `requests.document_url`.

### 6.6 Admin dashboard (`/admin`)
- Protected by a **simple password / env-based gate** (no full auth system for MVP — a single shared secret in an env var checked server-side is fine; flag the tradeoff).
- All Supabase reads here use the **service_role key, server-side only**.
- Features:
  - List all requests, newest first.
  - Filter by status (new / in_progress / ready / delivered) and by paid/unpaid.
  - View a request's full `data` (the form answers) cleanly rendered.
  - Change status. Upload/attach the finished document, or trigger PDF regeneration.
  - Show basic stats: today's count, total revenue (sum of `amount` where paid), per-service counts.

### 6.7 Telegram notification
- On new **paid** request: send me a message with service, client name, phone, amount, and a link to the admin request.
- Bot token + my chat ID in `.env`.

---

## 7. Security requirements (do not compromise)

1. **`service_role` key is server-only.** Never in client components, never `NEXT_PUBLIC_`. If you ever need request data in the browser for the owner, go through a server route protected by the admin gate.
2. **RLS stays enabled.** Anon can INSERT requests and SELECT services — nothing else.
3. **Validate & sanitize all form input server-side** before insert — don't trust the client.
4. **Rate-limit the submit endpoint** (e.g. simple IP-based limit or a lightweight check) to stop spam INSERTs, since anyone can insert. Flag if you add a captcha.
5. **Verify the Chargily webhook signature** before trusting any payment confirmation.
6. Never log secrets. `.env.example` should list every needed variable with placeholder values.

---

## 8. Environment variables (create `.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only — never NEXT_PUBLIC
CHARGILY_API_KEY=                 # test mode first
CHARGILY_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
ADMIN_PASSWORD=                   # simple gate for /admin
```

---

## 9. Build order (commit after each phase)

1. **Scaffold:** Next.js + TypeScript + Tailwind, design tokens wired into Tailwind config, fonts loaded, base layout (header/footer) in the palette.
2. **Supabase:** run the schema, set up the client (anon for browser, service_role for server), seed services.
3. **Landing page:** all sections, services pulled live from the DB, coming-soon cards.
4. **Dynamic form engine:** `<DynamicForm>` + CV and Facture configs, with live TVA/total math on the facture.
5. **Submit → Supabase insert** (paid:false), then **Chargily checkout** redirect (test mode).
6. **Chargily webhook** → mark paid → **Telegram ping**.
7. **PDF generation** for both services, saved to Storage.
8. **Admin dashboard:** gate, list, filter, detail view, status changes, stats.
9. **Polish:** responsive/mobile, RTL where Arabic appears, empty/error/loading states, spam rate-limit.

Deliver a working slice at each phase rather than everything at once. After scaffolding, show me the landing page before moving on.

---

## 10. Things to ask me, not assume
- Final prices per service.
- Live Chargily keys (start in test mode).
- Telegram bot token + my chat ID.
- Exact French/Arabic wording for the hero and trust section (use placeholders meanwhile).
- Whether CV photo upload is in or deferred.

Build clean, typed, well-structured code. Prefer clarity over cleverness. Keep the design restrained and premium throughout.
