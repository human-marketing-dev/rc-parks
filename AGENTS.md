<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> The block above is tool-managed — leave it as-is. Everything below is
> hand-maintained project context.

## Next 16 specifics already in use (don't "fix" them back)

The bundled docs under `node_modules/next/dist/docs/` exist after `npm install`.
Verify APIs there instead of assuming older behavior. What bites here:

- **Middleware lives in [`proxy.ts`](proxy.ts)**, not `middleware.ts`, and exports
  a `proxy()` function.
- **`params` is async** in layouts/pages — it's a `Promise`, always `await` it.
- **Route props use generated types**: `LayoutProps<"/[lang]">`,
  `PageProps<"/[lang]">` (global, generated into `.next/types`). Don't hand-roll
  param types. They only exist after a build/dev has generated `.next/types`, so
  a cold clone type-errors until `npm run build` runs once.
- **Turbopack** is the default for `next dev` and `next build`.
- **Tailwind CSS v4**: theme is CSS-first in [`app/globals.css`](app/globals.css)
  via `@theme` — there is **no `tailwind.config.js`**.

## What this is

Bilingual (es/en) single-page marketing landing for **R.C. Parks**, an
industrial park in Ciénega de Flores, N.L., Mexico. Static-generated per locale,
with one dynamic API route for the contact form. Deployed on Vercel.

**Stack:** Next.js 16.2 · React 19.2 · TypeScript 5 (strict) · Tailwind CSS v4.
No test runner, no state library, no icon/UI library (brand icons are inline SVG).

## Commands

```bash
npm run dev     # dev server (Turbopack) → http://localhost:3000
npm run build   # production build (also type-checks)
npm run start   # serve the production build
npm run lint    # eslint (next core-web-vitals + typescript)
```

There is no separate typecheck script — `npm run build` is the type gate.

## Architecture map

| Path | Responsibility |
| --- | --- |
| [`proxy.ts`](proxy.ts) | Locale redirect: sends locale-less paths to the browser's preferred locale (es fallback). **Matcher must keep excluding `api`** or `/api/contact` breaks. |
| [`app/[lang]/layout.tsx`](app/[lang]/layout.tsx) | Root layout, `generateStaticParams` (es/en), `generateMetadata`, mounts `AttributionTracker`. |
| [`app/[lang]/page.tsx`](app/[lang]/page.tsx) | The entire landing (server component). Reads the dictionary + hard data, renders every section. |
| [`app/[lang]/aviso-de-privacidad/page.tsx`](app/[lang]/aviso-de-privacidad/page.tsx) | Static bilingual privacy notice (LFPDPPP). All copy lives in the dictionaries' `privacy` block (`PrivacySection[]`); linked from the landing footer. Same slug in both locales so `LanguageSwitch` keeps working. |
| [`app/cotiza/`](app/cotiza/) · [`app/getquote/`](app/getquote/) | **Campaign landings** (Google Ads), one language each at a clean URL (es `/cotiza`, en `/getquote`). They live **outside `[lang]`**, so each folder is its own **root layout** (`layout.tsx` → `<html>` via `SiteShell`) — the pattern the Next docs call "omit `app/layout.js` and let subdirectories be root layouts." Both render the shared [`QuoteLanding`](app/components/quote-landing.tsx). Excluded from the `proxy.ts` matcher so they're **not** redirected to a locale. |
| [`app/components/quote-landing.tsx`](app/components/quote-landing.tsx) | The campaign landing (server component), parameterized by `lang`. Rental hero with the form in view, differentiator icon strip, product/inventory ranges, reused proof sections (amenities + location) and a closing form. Copy in the dictionaries' `quote` block; the form gets `consent` (required checkbox) + a "Solicitar Espacio" submit. |
| [`app/components/site-shell.tsx`](app/components/site-shell.tsx) | Shared `<html>/<body>` + GTM + attribution + WhatsApp wrapper used by **every** root layout (`[lang]`, `cotiza`, `getquote`) so the boilerplate lives once. |
| [`app/api/contact/route.ts`](app/api/contact/route.ts) | `POST` handler: origin check → honeypot → validation → Brevo email + GoHighLevel webhook. Server-only; all secrets from env. |
| [`app/content.ts`](app/content.ts) | **Hard data** (stats, borders, location groups, social links, contact info) + locale formatters (`formatDistance`, `formatArea`). |
| [`app/dictionaries/`](app/dictionaries/) | i18n strings. `es.ts` is the **source of truth**; `en.ts` must satisfy its type; `index.ts` exposes `locales`, `getDictionary`, `isLocale`. |
| [`app/lib/attribution.ts`](app/lib/attribution.ts) | Site-wide marketing attribution capture (UTMs, click IDs, cookies) with first/last touch in `localStorage`. |
| [`app/lib/analytics.ts`](app/lib/analytics.ts) | Measurement layer: the single entry point to the GTM `dataLayer` (`pushToDataLayer`) + typed event helpers (`trackGenerateLead`, `trackWhatsAppClick`). |
| [`app/components/`](app/components/) | UI. Client components carry `"use client"` (`contact-form`, `attribution-tracker`, `language-switch`, `location-tabs`, `reveal`, `whatsapp-provider`); prefer server components (`social-links`, `google-tag-manager`). |
| [`app/components/ui/`](app/components/ui/) | Design-system primitives (server-safe): `Container`, `Eyebrow`, `SectionTitle`, `Button`, `TextField`/`TextAreaField`. |
| [`app/globals.css`](app/globals.css) | **Design-system tokens** in the Tailwind v4 `@theme` (colors, type roles, radii, tracking, shell width) + `reveal`/`fade-up`/WhatsApp animation classes + reduced-motion. |
| [`docs/design-system.md`](docs/design-system.md) | Token tables, UI-primitive APIs, extension rules. |
| [`docs/ghl-webhook.md`](docs/ghl-webhook.md) | Contact → GoHighLevel/Brevo integration: payload contract, env vars, GHL workflow mapping, security. |
| [`docs/analytics.md`](docs/analytics.md) | Measurement: GTM container, `dataLayer` event schema, GTM / Enhanced-Conversions setup. |

## Conventions & invariants

- **i18n is type-enforced.** `Dictionary = typeof es`, and `en.ts` is annotated
  `Dictionary`. Add a key to **`es.ts` first**, then `en.ts`, or the build fails.
  Never let the two shapes drift.
- **Numbers live once, in `content.ts`**, formatted per locale (km↔mi, m²↔sq ft).
  Don't hardcode converted values into dictionaries — only unit labels belong there.
- **Comments are in Spanish** and explain the *why* (trade-offs, gotchas), not the
  *what*. Match that density and tone.
- **Server-first.** Only add `"use client"` when a component needs
  state/effects/browser APIs.
- **Imports are relative** (`../dictionaries`). A `@/*` alias exists in
  `tsconfig.json` but the codebase doesn't use it — stay consistent.
- **Styling goes through the design system** ([docs/design-system.md](docs/design-system.md)):
  colors, radii, tracking, and type roles are tokens in the `@theme` of
  `globals.css` (`bg-ink`, `rounded-card`, `text-display-lg`, `text-lead`…), and
  repeated recipes are primitives in `app/components/ui/` (`Container`,
  `Eyebrow`, `SectionTitle`, `Button`, `TextField`). **No hex values or new
  clamps in components** — name a token first. A one-off arbitrary value
  (`text-[15px]`) is fine until it repeats; then promote it.

## Integrations & environment

The contact form (`/api/contact`) fans out to two services. Full contract in
[`docs/ghl-webhook.md`](docs/ghl-webhook.md).

| Variable | Required | Purpose |
| --- | --- | --- |
| `BREVO_API_KEY` | yes | Brevo transactional email. |
| `BREVO_SENDER_EMAIL` | yes | Verified Brevo sender. |
| `CONTACT_TO_EMAIL` | yes | Internal recipient of requests. |
| `GHL_WEBHOOK_URL` | yes* | GoHighLevel inbound webhook. **No hardcoded default** (repo is public). |
| `GHL_WEBHOOK_SECRET` | yes* | Shared secret sent as `token`; the GHL workflow validates it. |

\* Needed for the CRM forward; without them the site still emails via Brevo.
Env files (`.env*`) are gitignored — never commit secrets or webhook URLs.

Security posture of `/api/contact`: server-side forward (URL never reaches the
browser), honeypot (`website` field), server-side validation and length caps.
(An `Origin` check was tried and reverted — behind www/apex/proxy hosting the
`Host` header didn't match `Origin` and it 403'd real submissions.) **Still
missing** rate limiting / CAPTCHA (Turnstile) — see the "pending" section of the
GHL doc before touching abuse-facing behavior.

### Measurement (GTM)

Site-wide Google Tag Manager (`GTM-TCKKHZ2T`) drives conversion tracking through a
`dataLayer`. Events so far: `generate_lead` (successful form submit, carries
Enhanced-Conversions `user_data`) and `whatsapp_click` (fired on the modal's final
button). **Never push to `dataLayer` directly** — always go through
[`app/lib/analytics.ts`](app/lib/analytics.ts). Container ID via
`NEXT_PUBLIC_GTM_ID` (optional; defaults to the committed ID — GTM IDs aren't
secret). Full contract in [`docs/analytics.md`](docs/analytics.md).

## Common tasks

- **Add/adjust copy:** edit `es.ts`, then mirror in `en.ts`.
- **Add a form field:** input in [`contact-form.tsx`](app/components/contact-form.tsx)
  → include it in the POST body → validate + forward in
  [`route.ts`](app/api/contact/route.ts) → add labels to both dictionaries.
- **Add a marketing param:** extend `QUERY_TO_FIELD`/`Touch` in
  [`attribution.ts`](app/lib/attribution.ts) and `TOUCH_KEYS` in `route.ts`.
- **Add an analytics event:** add a typed helper in
  [`analytics.ts`](app/lib/analytics.ts) that calls `pushToDataLayer`, invoke it
  from the relevant client component, then wire the trigger/tag in GTM.
- **Add a design token / UI variant:** token in the `@theme` of
  [`globals.css`](app/globals.css) (utility exists instantly); button variants in
  [`ui/button.tsx`](app/components/ui/button.tsx). See
  [docs/design-system.md](docs/design-system.md).
- **Add a locale:** add it to `locales` in `dictionaries/index.ts` and create the
  dict file; `proxy.ts` and `generateStaticParams` pick it up automatically.

## Gotchas

- Don't remove `api` (or `_next`, `assets`, `getquote`, `cotiza`) from the
  `proxy.ts` matcher. The last two are the campaign landings: they must serve at
  their clean URL, not get redirected to `/es`/`/en`. Any future clean-URL page
  outside `[lang]` needs the same exclusion **and** its own root layout.
- `params` must be awaited; `isLocale(lang)` guards unknown locales (the page
  calls `notFound()`).
- The honeypot must return the **same** success response as a real submit, and
  must neither email nor hit the CRM.
