# FINORA — Implementation Plan

## Product approach
Finora is a polished responsive personal-finance workspace with a seeded demo account, real MySQL-backed persistence, and a single-origin Express/Vite runtime. The browser cache is only a resilient fallback; authenticated workspace state is bootstrapped from and synchronized to MySQL through typed JSON API endpoints.

## Design direction
- **Design movement:** editorial fintech dashboard — calm, high-contrast surfaces with precise data density and a warm human tone.
- **Core principles:** signal over noise; actions are one tap away; numbers are explained, not merely displayed; every state feels intentional.
- **Color philosophy:** ink navy and cloud surfaces create trust; Finora Mint signals positive cash flow; coral marks warnings; violet is reserved for intelligence.
- **Layout paradigm:** persistent rail navigation plus an offset asymmetric content canvas, with narrative summaries beside evidence panels.
- **Signature elements:** mint pulse status dot, rounded ledger cards with thin dividers, and compact uppercase data labels.
- **Interaction philosophy:** progressive disclosure with editable modals, confirmation for destructive actions, and immediate derived-summary updates.
- **Animation:** restrained ease-out entrances, hover elevation, and progress transitions respecting reduced motion.
- **Typography:** Manrope for interface/body, Space Grotesk for display figures, and DM Mono for metadata.
- **Brand essence:** a confident money cockpit for people who want clarity without financial jargon. Clear, optimistic, disciplined.
- **Brand voice:** direct, reassuring, practical. “Your money has a pattern. Let’s make it work for you.”
- **Wordmark/logo:** Finora wordmark paired with a circular F-mark suggesting a balance ring and forward path.
- **Signature brand color:** Finora Mint `#9BE7C1`.

## Implementation structure
- `src/App.tsx`: route-aware authenticated shell, seeded state, API bootstrap/state sync, landing/auth gates, charts and modals.
- `src/index.css`: responsive design system, rail/mobile navigation, chart/card/table states and animation.
- `server/index.mjs`: Express API, additive MySQL schema initialization, session bootstrap, state persistence, health endpoint, Vite middleware in development and static serving in production.
- `server/schema.sql`: documented `finora_users` and `finora_states` tables.
- `scripts/test-local.mjs`: local health/bootstrap/state round-trip verification.
- `public/manus-routes.json`: canonical public/private page route manifest.
- `Dockerfile`: production build and single-origin container entrypoint.

## Functional scope
- Seeded demo profile and realistic income, expense, budget, goal and notification data.
- Working add/edit/delete transactions, income/expense forms, search/filter/sort, budget and goal updates, notification read state, theme persistence and logout.
- Derived totals, savings rate, budget usage, chart series and transparent insight copy computed from current state.
- Landing, login, signup and forgot-password screens with route guard behavior.
- API persistence through `GET /api/bootstrap`, `POST /api/session`, `POST /api/state`, and `GET /api/health`; MySQL is the primary store and localStorage is fallback only.
- AI-generated insights are deterministic data summaries with the required informational disclaimer.

## Serving and delivery
- Preview and container listen on port 3000 and honor `PORT`.
- Build output is `dist`.
- `DATABASE_URL`/`DRIZZLE_DATABASE_URL` is read only at runtime; no credentials are bundled into the frontend.
- The production container exposes unauthenticated `/api/health` for readiness.
